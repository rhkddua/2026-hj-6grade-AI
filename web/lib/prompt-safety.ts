// A conservative format check, not a guarantee that a request contains no personal data.
export function textAppearsSafe(value: string) {
  const text = value.normalize('NFKC');
  // Values are checked before negative instructions, so a value in a prohibition still fails.
  if (/(?:\+82[ .-]?)?0?1[016789][ .-]?\d{3,4}[ .-]?\d{4}|0(?:2|[3-6]\d)[ .-]?\d{3,4}[ .-]?\d{4}|\b\d{3}[ -]?\d{3,4}[ -]?\d{4}\b/.test(text)) return false;
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) || /\d{6}[ -]?[1-8]\d{6}/.test(text)) return false;
  if (/(?:password|passwd|pwd|api[ _-]?key|(?:access[ _-]?)?token|secret|비밀번호|비번|인증[ ]?번호|토큰)\s*[:=]\s*\S+/i.test(text)) return false;
  const sensitive = /비밀번호|전화번호|집\s*주소|이메일\s*주소|주민등록(?:번호)?|실제\s*이름|password|api[ _-]?key|access[ _-]?token/gi;
  for (const match of text.matchAll(sensitive)) {
    const tail = text.slice((match.index ?? 0) + match[0].length);
    const negative = /^(?:를|을|는|은|도)?\s*(?:(?:입력\s*받|입력받|받|수집하|요구하|저장하|사용하|표시하|공개하)지\s*(?:않(?:게|도록|아|아요|는다|습니다)|말(?:아|고|아요|도록))|(?:입력|수집|요구|저장|사용)\s*하지\s*(?:않(?:게|도록|아요|는다)|말(?:아|고|아요))|없이|대신\s*별명)/.exec(tail);
    if (!negative) return false;
    const rest = tail.slice(negative[0].length).split(/[.!?\n]/, 1)[0]
      .replace(/(?:놀이(?:\s*이름)?|준비물|추천\s*결과|결과\s*카드|활동\s*이름|안내|버튼|목록|글자)(?:을|를)?\s*(?:(?:큰\s*글씨|화면|카드|목록)(?:로|에)?\s*)?(?:보여\s*줘|표시해|보여\s*주게)/g, '');
    if (/(?:받아|수집해|요구해|저장해|표시해|공개해|넣어|보여\s*줘|보여\s*주|전송|보내|업로드)/.test(rest)) return false;
  }
  return true;
}
