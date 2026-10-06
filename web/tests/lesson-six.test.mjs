import { test } from 'node:test';
import assert from 'node:assert/strict';
import './register-ts-imports.mjs';
const { initialActivities, restoreActivities, lessonSixRequirements, promptIsSafe } = await import('../lib/lesson-six.ts');
const valid={...initialActivities(),conceptChoice:0,conceptChecked:true,inputChoice:0,actionChoice:0,outputChoice:0,flowChecked:true,ownPrompt:'6학년의 놀이 추천 버튼을 누르면 목록에서 놀이와 준비물을 골라 큰 글씨로 보여 줘.',promptChecked:true,resultChoice:1,testChoices:[true,true,true],testChecked:true,revisionPrompt:'결과의 준비물을 큰 글씨 목록으로 보여 주세요.',answers:[0,1,1],quizChecked:true};
test('6차시 과거 14키·보기 인덱스·6조건을 유지한다',()=>{
 assert.deepEqual(restoreActivities(JSON.parse(JSON.stringify(valid))),valid);
 assert.equal(Object.keys(valid).length,14);
 assert.deepEqual(lessonSixRequirements(valid,'직접 시험한 실패를 기록하고 다시 확인해요.'),Array(6).fill(true));
});
test('6차시 흐름 오답·미점검·미채점·짧은 글을 막는다',()=>{
 for(const patch of [{conceptChoice:1},{inputChoice:1},{actionChoice:1},{outputChoice:1},{flowChecked:false},{promptChecked:false},{ownPrompt:'짧음'},{resultChoice:0},{testChoices:[true,false,true]},{revisionPrompt:'짧음'},{answers:[1,1,1]},{quizChecked:false}]) assert.equal(lessonSixRequirements({...valid,...patch},'충분히 긴 성찰 문장입니다.').every(Boolean),false);
 assert.equal(lessonSixRequirements(valid,'짧음').every(Boolean),false);
});
test('6차시 안전 부정문과 합성 연락처를 구별하고 35자를 유지한다',()=>{
 assert.equal(promptIsSafe('가'.repeat(34)),false);
 assert.equal(promptIsSafe(valid.ownPrompt+' 비밀번호를 요구하지 않는다.'),true);
 assert.equal(promptIsSafe(valid.ownPrompt+' 전화번호를 받지 않게. 010-0000-0000'),false);
 assert.equal(promptIsSafe(valid.ownPrompt+' student@example.test'),false);
});
