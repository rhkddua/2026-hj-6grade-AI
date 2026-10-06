import { test } from 'node:test';
import assert from 'node:assert/strict';
import './register-ts-imports.mjs';
const { initialActivities, restoreActivities, lessonFiveRequirements, promptIsSafe } = await import('../lib/lesson-five.ts');
const valid = { ...initialActivities(), introChoice: 1, introChecked: true, userChoice: 0, problemChoice: 0, featureChoice: 0, planChecked: true, ownPrompt: '우리 반 친구가 쉬는 시간 놀이를 고르도록 추천 버튼과 큰 글씨 결과를 만들어 줘.', promptChecked: true, resultChoice: 1, testChoices: [true,true,true], testChecked: true, revisionPrompt: '안내가 작아요. 글자를 더 크게 바꿔 주세요.', answers:[0,1,0], quizChecked:true };
test('기존 14개 활동 키와 6개 완료 조건을 복원한다',()=>{
 assert.equal(Object.keys(valid).length,14);
 assert.deepEqual(restoreActivities(JSON.parse(JSON.stringify(valid))),valid);
 assert.deepEqual(lessonFiveRequirements(valid,'실패한 결과도 기록하고 같은 순서로 다시 시험해요.'),Array(6).fill(true));
});
test('오답·미점검·짧은 글·위험값은 완료를 막는다',()=>{
 for(const patch of [{introChoice:0},{planChecked:false},{promptChecked:false},{ownPrompt:'짧아요'},{ownPrompt:valid.ownPrompt+' 010-0000-0000'},{resultChoice:0},{testChoices:[true,false,true]},{revisionPrompt:'짧아요'},{answers:[1,1,0]},{quizChecked:false}]) assert.equal(lessonFiveRequirements({...valid,...patch},'충분히 긴 성찰 문장입니다.').every(Boolean),false);
 assert.equal(lessonFiveRequirements(valid,'짧음').every(Boolean),false);
 assert.equal(promptIsSafe(valid.ownPrompt+' 전화번호를 받지 않게 해 줘.'),true);
});
