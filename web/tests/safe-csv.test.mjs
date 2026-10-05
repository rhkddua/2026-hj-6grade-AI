import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csvCell, createCsv } from '../lib/safe-csv.ts';

test('스프레드시트 수식 시작 문자와 선행 공백을 텍스트로 처리한다', () => {
  for (const value of ['=1+1', '+SUM(1,2)', '-1+2', '@SUM(1,2)', '  =1+1', '\t=1+1', '\rtest', '\uFEFF=1+1']) {
    assert.ok(csvCell(value).startsWith('"\''), value);
  }
});
test('한글, 쉼표, 따옴표, 여러 줄을 보존하며 CSV 셀 경계를 이스케이프한다', () => {
  assert.equal(csvCell('테스트, "학생"\n문장'), '"테스트, ""학생""\n문장"');
  assert.equal(csvCell(10), '"10"');
  assert.equal(createCsv([['이름', '점수'], ['학생', 3]]), '\uFEFF"이름","점수"\r\n"학생","3"');
});
