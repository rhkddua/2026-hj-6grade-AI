import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textAppearsSafe } from '../lib/prompt-safety.ts';

test('안전한 금지 요청과 일반 제작 지시를 허용한다', () => {
  for (const text of ['추천 버튼을 누르면 놀이와 준비물을 보여 줘.', '전화번호를 받지 않게 해 줘.', '비밀번호를 요구하지 않는다.', '실제 이름 대신 별명을 사용해.', '집 주소 없이 사용하게 해 줘.', '이메일 주소를 입력받지 않도록 해 줘.', '비밀번호를 요구하지 말고 놀이 이름을 표시해.']) assert.equal(textAppearsSafe(text), true, text);
});
test('금지 문장 안에서도 실제 값 형태와 명시적 비밀값을 차단한다', () => {
  for (const value of ['010-0000-0000', '02-000-0000', '010 0000 0000', '010.0000.0000', '０１０－００００－００００', 'student@example.test', '000101-3000000', '비밀번호: DEMO_ONLY', '비번=DEMO_ONLY', 'pwd=DEMO_ONLY', 'password=DEMO_ONLY', 'api_key=DEMO_ONLY', 'token=DEMO_ONLY']) assert.equal(textAppearsSafe('사용하지 마세요: ' + value), false, value);
});
test('안전한 절 하나가 다른 위험한 요청을 허용하지 않는다', () => {
  for (const text of ['전화번호를 받지 말고 비밀번호를 저장해.', '비밀번호를 요구하지 말고 화면에 표시해.', '비밀번호를 요구하지 말고 화면에 보여 줘.', '전화번호를 받지 말고 서버에 전송해.', '전화번호를 받지 않게. 전화번호를 저장해.', '개인정보 없이 친구의 전화번호를 받아.', '전화번호를 받지 않게 하고 수집해.']) assert.equal(textAppearsSafe(text), false, text);
});
