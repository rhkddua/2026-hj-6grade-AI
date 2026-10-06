import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreActivities, lessonFourRequirements, lessonFourExamples, detailOptions } from '../lib/lesson-four.ts';
const old={opening:1,clueChoices:[0,1,2,3],cluesChecked:true,detailChoices:[true,true,false],detailResultChecked:true,revisionChoices:[0,1,0],revisionsChecked:true,answers:[0,1,2],quizChecked:true,ownPrompt:'6학년이 쉬는 시간에 할 놀이를 세 가지 표로 알려 주세요.'};
test('4차시 과거 답과 6개 필수 조건을 그대로 복원한다',()=>{
 assert.deepEqual(restoreActivities(JSON.parse(JSON.stringify(old))),old);
 assert.deepEqual(lessonFourRequirements(old,'결과에서 빠진 조건을 확인하고 다시 요청해요.'),Array(6).fill(true));
 assert.equal(lessonFourRequirements({...old,detailChoices:[true,false,false]},'충분히 긴 성찰 문장입니다.')[1],false);
 assert.equal(lessonFourRequirements({...old,detailResultChecked:false},'충분히 긴 성찰 문장입니다.')[1],false);
});
for(const choices of [[true,true,false],[true,false,true],[false,true,true],[true,true,true]]){
 test(`조건 ${choices.join('/')}에 대응하는 요청과 예시`,()=>{
  const result=lessonFourExamples(choices);
  assert.equal(result.rows.length,3);
  assert.equal(result.comparisons.length,choices.filter(Boolean).length);
  detailOptions.forEach((option,i)=>assert.equal(result.request.includes(option),choices[i]));
  assert.ok(result.rows.every(row=>(row.reason!==null)===choices[2]));
  assert.equal(result.rows.every(row=>row.place.startsWith('교실')),choices[1]);
  assert.equal(result.rows[0].method.includes('어휘 연쇄'),!choices[0]);
 });
}
test('조건 선택은 다른 조건의 결과를 덮어쓰지 않는다',()=>{
 const base=lessonFourExamples([false,false,false]);
 const easy=lessonFourExamples([true,false,false]);
 assert.deepEqual(base.rows.map(x=>x.place),easy.rows.map(x=>x.place));
 const reasons=lessonFourExamples([false,false,true]);
 assert.deepEqual(base.rows.map(x=>x.method),reasons.rows.map(x=>x.method));
 assert.notDeepEqual(lessonFourExamples([true,true,false]),lessonFourExamples([true,false,true]));
});
