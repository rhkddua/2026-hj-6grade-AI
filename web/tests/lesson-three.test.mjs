import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialActivities, restoreActivities, lessonThreeRequirements } from '../lib/lesson-three.ts';
const oldRecord = {opening:1,strengthChoices:[0,0,0],strengthChecked:true,limitationChoices:[1,1,1,1],limitationChecked:true,verificationChoices:[0,1,0],verificationChecked:true,answers:[1,2,1],quizChecked:true};
const reflection='학교가 안내한 같은 날짜의 급식표로 메뉴를 확인해요.';
test('3차시 과거 답의 순서와 완료 조건을 보존한다',()=>{
 const restored=restoreActivities(JSON.parse(JSON.stringify(oldRecord)));
 assert.deepEqual(restored,oldRecord);
 assert.ok(lessonThreeRequirements(restored,reflection).every(Boolean));
});
test('안전 오답 또는 재확인 누락과 짧은 성찰은 완료를 막는다',()=>{
 assert.equal(lessonThreeRequirements({...oldRecord,verificationChoices:[0,0,0]},reflection)[2],false);
 assert.equal(lessonThreeRequirements({...oldRecord,verificationChecked:false},reflection)[2],false);
 assert.equal(lessonThreeRequirements(oldRecord,'짧음')[4],false);
 assert.ok(lessonThreeRequirements(initialActivities(),'').every(x=>!x));
});
test('잘못된 저장 값은 안전한 기본값으로 복원한다',()=>{
 const restored=restoreActivities({verificationChoices:[2,-1,'0'],strengthChecked:'true',answers:[null,99,1]});
 assert.deepEqual(restored.verificationChoices,[null,null,null]);
 assert.equal(restored.strengthChecked,false);
 assert.deepEqual(restored.answers,[null,null,1]);
});
