export const stages = ['기능 설계 알아보기', '사용자 흐름 정하기', '기능 설명 쓰기', '화면을 테스트하고 고치기', '배움 확인하기'];
export const flowOptions = {
  userActions: ['추천 버튼을 누르기', '친구의 연락처를 입력하기', '비밀번호를 입력하기'],
  appActions: ['놀이와 준비물을 골라 보여 주기', '개인정보를 다른 사람에게 보내기', '광고를 자동으로 열기'],
  feedbacks: ['무엇이 바뀌었는지 큰 글씨로 알려 주기', '아무 설명 없이 화면을 닫기', '실제 이름을 공개하기'],
};
export const testChecks = ['버튼을 눌렀을 때 정한 결과가 바로 나타나는지 확인했어요.', '결과와 다음에 할 일을 처음 보는 사람도 이해할 수 있는지 확인했어요.', '기능을 쓰는 동안 개인정보를 요구하지 않는지 확인했어요.'];
export const questions = [
  { title: '기능을 설계할 때 먼저 생각할 내용은?', options: ['사용자가 무엇을 하고 어떤 도움을 받는지', '친구의 비밀번호', '광고를 많이 보여 줄 방법'], answer: 0, tip: '사용자의 행동과 앱이 주는 도움을 연결하면 기능이 분명해져요.' },
  { title: '좋은 화면 피드백은 무엇일까요?', options: ['버튼을 누른 뒤 무엇이 달라졌는지 알려 줘요.', '아무 변화 없이 끝나요.', '개인정보를 공개해요.'], answer: 0, tip: '사용자는 자신의 행동 뒤에 어떤 결과가 나왔는지 알아야 해요.' },
  { title: '테스트 뒤 알맞은 수정 지시는?', options: ['글자를 크게 하고 결과 제목을 더 분명하게 보여 줘.', '확인하지 말고 제출해.', '전화번호를 입력하게 해.'], answer: 0, tip: '불편했던 지점과 바라는 모습을 구체적으로 말해요.' },
];
export type LessonSevenActivities = { conceptChoice:number|null; conceptChecked:boolean; userAction:number|null; appAction:number|null; feedback:number|null; flowChecked:boolean; featurePlan:string; planChecked:boolean; resultChoice:number|null; testChoices:boolean[]; testChecked:boolean; revisionPrompt:string; answers:Array<number|null>; quizChecked:boolean };
export function initialActivities():LessonSevenActivities { return {conceptChoice:null,conceptChecked:false,userAction:null,appAction:null,feedback:null,flowChecked:false,featurePlan:'',planChecked:false,resultChoice:null,testChoices:testChecks.map(()=>false),testChecked:false,revisionPrompt:'',answers:questions.map(()=>null),quizChecked:false}; }
function choices(value:unknown,count:number,max:number){return Array.from({length:count},(_,i)=>Array.isArray(value)&&Number.isInteger(value[i])&&(value[i] as number)>=0&&(value[i] as number)<=max?value[i] as number:null);}
export function restoreActivities(value:unknown):LessonSevenActivities { const base=initialActivities(); if(!value||typeof value!=='object') return base; const v=value as Record<string,unknown>; const choice=(key:string,max:number)=>Number.isInteger(v[key])&&(v[key] as number)>=0&&(v[key] as number)<=max?v[key] as number:null; return {...base,conceptChoice:choice('conceptChoice',2),conceptChecked:v.conceptChecked===true,userAction:choice('userAction',2),appAction:choice('appAction',2),feedback:choice('feedback',2),flowChecked:v.flowChecked===true,featurePlan:typeof v.featurePlan==='string'&&v.featurePlan.length<=1000?v.featurePlan:'',planChecked:v.planChecked===true,resultChoice:choice('resultChoice',1),testChoices:testChecks.map((_,i)=>Array.isArray(v.testChoices)&&v.testChoices[i]===true),testChecked:v.testChecked===true,revisionPrompt:typeof v.revisionPrompt==='string'&&v.revisionPrompt.length<=1000?v.revisionPrompt:'',answers:choices(v.answers,questions.length,2),quizChecked:v.quizChecked===true}; }
export function planIsSafe(plan:string){const text=plan.trim();return text.length>=35&&!/(비밀번호|전화번호|집 주소|이메일 주소|주민등록|실제 이름)/.test(text)&&!/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);}
export function lessonSevenRequirements(a:LessonSevenActivities,reflection:string){return [a.conceptChecked&&a.conceptChoice===0,a.flowChecked&&a.userAction===0&&a.appAction===0&&a.feedback===0,a.planChecked&&planIsSafe(a.featurePlan),a.testChecked&&a.resultChoice===1&&a.testChoices.every(Boolean)&&a.revisionPrompt.trim().length>=15,a.quizChecked&&questions.every((q,i)=>a.answers[i]===q.answer),reflection.trim().length>=10];}
