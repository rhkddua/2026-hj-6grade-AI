import fs from 'node:fs';
import assert from 'node:assert/strict';
const accounts = fs.readFileSync('../TEST_ACCOUNT.md', 'utf8');
const field = (label) => accounts.match(new RegExp(`^- ${label}:\\s*\x60?([^\x60\\r\\n]+)`, 'm'))?.[1].trim();
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(x=>x.includes('=')).map(x=>{ const i=x.indexOf('=');return [x.slice(0,i),x.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]; }));
const base=env.VITE_SUPABASE_URL, key=env.VITE_SUPABASE_PUBLISHABLE_KEY;
const sessions=[];
async function request(path,body,token,method='POST') {
  const r=await fetch(base+path,{method,signal:AbortSignal.timeout(20000),headers:{apikey:key,...(token?{Authorization:`Bearer ${token}`} : {}),'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const raw=await r.text();let data;try{data=JSON.parse(raw)}catch{data=raw};return {status:r.status,data};
}
async function login(email,password){const r=await request('/auth/v1/token?grant_type=password',{email,password});assert.equal(r.status,200,'test login');sessions.push(r.data.access_token);return r.data;}
const ok=(r,label)=>{assert.ok(r.status>=200&&r.status<300,`${label}: ${r.status} ${r.data?.message??''}`);return r.data};
const denied=(r,label)=>{assert.ok([401,403].includes(r.status),`${label}: ${r.status}`);console.log('PASS',label);};
let original, admin, student;
const list=async()=>ok(await request('/rest/v1/rpc/read_admin_reflection_board',{p_search:student.user.id},admin.access_token),'admin read');
const moderate=async(entry,hidden,reason)=>request('/rest/v1/rpc/moderate_lesson_reflection',{p_user_id:entry.user_id,p_lesson_no:entry.lesson_no,p_hidden:hidden,p_reason:reason,p_expected_version:entry.moderation_version,p_expected_updated_at:entry.updated_at},admin.access_token);
try {
 student=await login(field('이메일'),field('임시 비밀번호'));
 admin=await login(field('관리자 이메일'),field('관리자 비밀번호'));
 const studentToken=student.access_token;
 denied(await request('/rest/v1/rpc/read_admin_reflection_board',{},undefined),'signed-out admin RPC denied');
 denied(await request('/rest/v1/rpc/read_admin_reflection_board',{},studentToken),'student admin RPC denied');
 denied(await request('/rest/v1/rpc/read_admin_reflection_audit',{p_user_id:student.user.id,p_lesson_no:1},studentToken),'student audit denied');
 denied(await request('/rest/v1/rpc/moderate_lesson_reflection',{p_user_id:student.user.id,p_lesson_no:1,p_hidden:true,p_reason:'권한 차단 테스트',p_expected_version:0,p_expected_updated_at:new Date().toISOString()},studentToken),'student moderation denied');
 denied(await request('/rest/v1/lesson_reflection_board?select=*',undefined,studentToken,'GET'),'direct board table denied');
 denied(await request('/rest/v1/reflection_moderation_audit?select=*',undefined,studentToken,'GET'),'direct audit table denied');
 denied(await request('/rest/v1/rpc/read_lesson_reflection_board',{},admin.access_token),'nonstudent admin student RPC denied');
 let rows=await list();assert.ok(rows.length>0,'existing test reflection needed');original=rows.find(x=>!x.is_hidden)??rows[0];
 assert.equal(original.account_email,student.user.email);assert.equal(original.student_no,49);console.log('PASS admin author account and student metadata');
 let publicRows=ok(await request('/rest/v1/rpc/read_lesson_reflection_board',{},studentToken),'student board');assert.ok(publicRows.every(x=>Object.keys(x).sort().join(',')==='lesson_no,reflection,updated_at'));console.log('PASS student anonymous fields');
 const before=ok(await request('/rest/v1/rpc/read_admin_reflection_audit',{p_user_id:student.user.id,p_lesson_no:original.lesson_no},admin.access_token),'audit baseline');
 ok(await moderate(original,true,'관리자 기능 검증: 테스트 학생 글 숨김'),'hide');console.log('PASS hide');
 let hidden=(await list()).find(x=>x.lesson_no===original.lesson_no);assert.equal(hidden.is_hidden,true);
 publicRows=ok(await request('/rest/v1/rpc/read_lesson_reflection_board',{p_lesson_no:original.lesson_no},studentToken),'hidden student read');assert.ok(!publicRows.some(x=>x.reflection===original.reflection));console.log('PASS hidden excluded');
 const conflict=await moderate(original,false,'관리자 기능 검증: 오래된 응답 거부');assert.equal(conflict.data?.code,'P0001');console.log('PASS stale moderation denied');
 ok(await request('/rest/v1/rpc/publish_lesson_reflection',{p_lesson_no:original.lesson_no,p_reflection:original.reflection},studentToken),'repost original');
 hidden=(await list()).find(x=>x.lesson_no===original.lesson_no);assert.equal(hidden.is_hidden,true);console.log('PASS repost retains hidden state');
 ok(await moderate(hidden,original.is_hidden,'관리자 기능 검증 완료: 원래 공개 상태 복원'),'restore');
 let restored=(await list()).find(x=>x.lesson_no===original.lesson_no);assert.equal(restored.is_hidden,original.is_hidden);assert.equal(restored.reflection,original.reflection);console.log('PASS restore original text and visibility');
 const audit=ok(await request('/rest/v1/rpc/read_admin_reflection_audit',{p_user_id:student.user.id,p_lesson_no:original.lesson_no},admin.access_token),'audit');assert.ok(audit.length>=before.length+2);assert.ok(audit.some(x=>x.action==='hide'));assert.ok(audit.some(x=>x.action==='restore'));console.log('PASS atomic moderation audit');
 const progress=ok(await request('/rest/v1/lesson_progress?select=lesson_no,completed&user_id=eq.'+student.user.id,undefined,admin.access_token,'GET'),'admin progress');assert.ok(progress.length>0);console.log('PASS admin lesson progress access');
 console.log('ALL LIVE API CHECKS PASSED');
} finally {
 if(original&&admin&&student){try{const current=(await list()).find(x=>x.lesson_no===original.lesson_no);if(current&&current.is_hidden!==original.is_hidden)ok(await moderate(current,original.is_hidden,'검증 종료: 테스트 글 공개 상태 복원'),'cleanup');}catch(e){console.error('RESTORE FAILED',e.message);process.exitCode=1;}}
 for(const token of sessions){await request('/auth/v1/logout?scope=local',{},token);}
}
