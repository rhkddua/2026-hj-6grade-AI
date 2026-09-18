export function koreanAuthError(message: string, code?: string) {
  const text = message.toLowerCase();
  if (code === 'email_address_invalid' || (text.includes('email address') && text.includes('invalid'))) return '사용할 수 없는 이메일 주소예요. example.com 같은 예시 주소 대신 확인 메일을 받을 수 있는 실제 이메일을 입력해 주세요.';
  if (code === 'email_address_not_authorized' || text.includes('email address not authorized')) return '현재 메일 발송 설정으로는 이 이메일에 확인 메일을 보낼 수 없어요. 선생님께 메일 발송 설정 확인을 요청해 주세요.';
  if (code === 'over_email_send_rate_limit' || text.includes('email rate limit')) return '확인 이메일 발송 한도에 도달했어요. 지금 반복해서 가입하지 말고, 잠시 뒤 다시 시도해 주세요. 계속되면 선생님께 알려 주세요.';
  if (code === 'email_not_confirmed' || text.includes('email not confirmed')) return '이메일 확인이 필요해요. 받은 편지함과 스팸함에서 확인 링크를 누른 뒤 로그인해 주세요.';
  if (text.includes('invalid login credentials')) return '이메일 또는 비밀번호를 다시 확인해 주세요.';
  if (text.includes('user already registered')) return '이미 가입된 이메일입니다. 로그인해 주세요.';
  if (text.includes('database error saving new user')) return '학생 정보를 등록하지 못했어요. 이름·반·번호를 확인하고, 이미 가입한 반·번호라면 기존 계정으로 로그인해 주세요. 계속되면 선생님께 알려 주세요.';
  if (code === 'weak_password' || text.includes('password should be')) return '비밀번호는 6자 이상으로 만들어 주세요.';
  if (text.includes('rate limit') || code === 'over_request_rate_limit') return '요청이 너무 많아요. 반복해서 누르지 말고 잠시 뒤 다시 시도해 주세요.';
  return '처리하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.';
}
