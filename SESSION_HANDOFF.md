# 초등 AI 코딩 10차시 수업 웹사이트 — 세션 인수인계

> 작성일: 2026-09-17  
> 목적: 다음 Codex 세션에서 별도 탐색을 최소화하고 바로 개발을 이어가기 위한 현재 상태 요약

## 1. 한눈에 보는 현재 상태

이 프로젝트는 초등학교 6학년 전체 학급을 대상으로 하는 **10차시 AI 코딩 수업 웹 플랫폼**이다. 학생이 코딩의 역사와 AI 코딩의 특징을 배우고, Canva AI 코드로 앱을 제작하는 수업을 지원하는 것이 최종 목표다.

현재까지 다음 항목이 완료되었다.

- 10차시 수업 계획과 PRD 작성
- 학생용 대시보드 기본 UI
- 1차시 전체 수업 콘텐츠와 상호작용 구현
- 2차시 UI 시제품 구현
- Supabase 연결
- 학생 이메일·비밀번호 회원가입 및 로그인 구현
- 학생 프로필과 1차시 학습 진도 저장용 데이터베이스 구축
- 학생별 데이터 격리를 위한 Supabase RLS 정책 적용
- OpenAI Sites 공개 배포

현재 공개 주소:

- <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>

현재 사이트는 공개 URL이지만, 학생용 홈과 1·2차시 페이지는 클라이언트에서 로그인 여부를 확인하고 로그인하지 않은 사용자를 `/login`으로 이동시킨다. 실제 데이터 접근은 Supabase RLS로 보호된다.

교사용 계정과 교사 권한은 아직 구현하지 않는다. `/teacher`에는 초기 목업 화면이 남아 있으나 학생 화면에서 링크는 제거되었다.

---

## 2. 저장소와 주요 경로

### 로컬 작업공간

```text
C:\Users\rhkdd\OneDrive\문서\2학기 전학공
```

### 웹 프로젝트

```text
C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web
```

### GitHub 저장소

- <https://github.com/rhkddua/2026-hj-6grade-AI>
- 브랜치: `main`

### 중요한 Git 상태

이 문서 작성 시점에 **GitHub용 상위 저장소에는 최근 작업이 아직 커밋·푸시되지 않았다.**

상위 저장소의 최근 커밋:

```text
f40d843 merge: preserve existing GitHub history
1e69ad0 feat: add AI coding classroom frontend
010b86e Add files via upload
```

현재 다음 변경이 상위 저장소에서 수정 또는 미추적 상태다.

```text
M  README.md
M  web/.gitignore
M  web/app/lesson/2/page.tsx
M  web/app/page.tsx
M  web/package-lock.json
M  web/package.json
?? web/.env.example
?? web/app/lesson/1/
?? web/app/login/
?? web/lib/lesson-progress.ts
?? web/lib/student-auth.ts
?? web/lib/supabase.ts
?? web/supabase/
```

따라서 다음 세션에서 GitHub 동기화를 요청받으면 먼저 `git status`와 diff를 확인한 뒤, 현재 변경 전체를 상위 저장소에 커밋하고 `origin/main`으로 푸시해야 한다. 사용자 변경을 잃지 않도록 reset이나 checkout으로 되돌리지 않는다.

OpenAI Sites 배포 과정에서는 `web` 폴더에 임시 중첩 Git 저장소를 만들었다가 배포 후 제거했다. 현재는 `web/.git`과 임시 `site.tar.gz`가 제거되어 상위 Git 저장소가 정상적으로 `web` 내부 파일을 추적할 수 있다.

---

## 3. 기술 스택

- React 19
- Vinext `1.0.0-beta.5`
- Vite 8
- TypeScript
- Tailwind CSS 4
- Shadcn 기반 UI 컴포넌트
- Lucide React 아이콘
- Supabase JS `^2.116.0`
- Supabase Authentication + PostgreSQL + RLS
- OpenAI Sites / Cloudflare Workers 호스팅

주요 명령:

```powershell
cd "C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web"
npm install
npm run dev
npm run build
```

최종 빌드는 학생 로그인 기능 추가 후 성공했다. 빌드 결과 라우트는 다음과 같다.

```text
/
/login
/lesson/1
/lesson/2
/teacher
```

---

## 4. OpenAI Sites 배포 정보

### Sites 프로젝트

- 프로젝트 ID: `appgprj_6a962dcd21f08191876edad89331f7c3`
- 슬러그: `hj-ai-coding-class-2026`
- 사이트 제목: `AI 코딩 교실`
- 공개 주소: <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>
- 접근 모드: `public`
- 최신 배포 버전: version 5
- 최신 배포 상태: 성공

로컬 설정 파일:

```text
web/.openai/hosting.json
```

현재 내용:

```json
{
  "project_id": "appgprj_6a962dcd21f08191876edad89331f7c3",
  "d1": null,
  "r2": null
}
```

Sites의 D1/R2는 사용하지 않는다. 영속 데이터는 외부 Supabase를 HTTP 클라이언트로 사용한다.

Sites 운영 환경에는 다음 변수가 등록되어 있다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`VITE_*` 값은 클라이언트 번들에 포함되는 공개 설정값이다. 관리자용 `service_role` 키는 사용하거나 등록하지 않았다.

### Sites 재배포 시 주의사항

- 이 프로젝트는 기존 공개 사이트이므로 배포 전에 현재 접근 수준이 `public`인지 확인한다.
- Sites 지침상 공개 배포 직전 사용자 승인을 받아야 한다.
- Sites 배포용 저장소는 GitHub 저장소와 별개다.
- 배포용 임시 Git은 반드시 `web` 폴더를 루트로 사용한다. 상위 GitHub 저장소를 Sites 배포 저장소로 밀지 않는다.
- 배포 완료 후 임시 `web/.git`과 `web/site.tar.gz`를 제거한다.
- Windows에서 패키징 스크립트를 실행할 때 Git Bash의 `/usr/bin`을 PATH에 넣어야 했다.

이 세션에서 성공한 패키징 형태:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' -c 'export PATH="/usr/bin:/mingw64/bin:$PATH"; "/c/Users/rhkdd/.codex/plugins/cache/openai-bundled/sites/0.1.57/scripts/package-site.sh" . site.tar.gz'
```

Sites 플러그인 버전은 세션마다 달라질 수 있으므로 다음 세션에서는 설치된 최신 `sites-building`과 `sites-hosting`의 `SKILL.md`를 다시 읽고 해당 버전의 스크립트 경로를 사용한다.

---

## 5. Supabase 상태

### 프로젝트

- Project URL: `https://ujhcwxscxepbttqcysal.supabase.co`
- Project ref: `ujhcwxscxepbttqcysal`

실제 Publishable key는 다음 파일에만 저장되어 있다.

```text
web/.env.local
```

`web/.env.local`은 `.gitignore`에 의해 Git에서 제외된다. 이 인수인계 문서에는 키 값을 복제하지 않는다.

공개 설정 예시는 다음 파일에 있다.

```text
web/.env.example
```

### Authentication 현재 설정

- Email provider: 활성화
- 신규 사용자 가입: 활성화
- 이메일 확인: 활성화
- 익명 로그인: 비활성화
- 교사용 인증: 미구현

학생 가입 후 Supabase 확인 이메일의 링크를 눌러야 실제 로그인이 가능하다.

### 반드시 점검해야 하는 인증 설정

Supabase의 **Authentication → URL Configuration**에서 다음 항목은 아직 명시적으로 검증하지 않았다.

- Site URL이 실제 공개 사이트 주소인지
- Redirect URLs에 공개 사이트 주소가 등록되어 있는지

이 설정이 잘못되어 있으면 확인 이메일 링크가 `localhost` 또는 잘못된 주소로 이동할 수 있다. 다음 세션의 높은 우선순위 점검 항목이다.

권장 Site URL:

```text
https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site
```

### 데이터베이스 스키마

스키마 원본:

```text
web/supabase/schema.sql
```

이 SQL은 Supabase SQL Editor에서 실제로 실행되었다.

#### `public.student_profiles`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `user_id` | uuid PK | `auth.users.id` 참조, 사용자 삭제 시 함께 삭제 |
| `student_name` | text | 2~30자 학생 이름 |
| `grade` | smallint | 현재 6만 허용 |
| `class_no` | smallint | 1~20 |
| `student_no` | smallint | 1~50 |
| `created_at` | timestamptz | 생성 시각 |

제약:

```text
unique (grade, class_no, student_no)
```

같은 학년·반·번호로 두 학생을 가입시킬 수 없다.

RLS:

- 로그인한 학생은 자신의 프로필만 SELECT 가능
- 클라이언트 직접 INSERT/UPDATE 정책은 없음

#### `public.handle_new_student()` 트리거 함수

Supabase Auth 사용자가 생성되면 `raw_user_meta_data`의 다음 값을 읽어 `student_profiles`에 자동 삽입한다.

```text
student_name
grade
class_no
student_no
```

트리거:

```text
on_auth_user_created
```

중요한 제약: 이 트리거는 현재 `auth.users`의 **모든 신규 사용자**에 실행된다. 향후 교사 계정을 추가할 때 교사에게 학생 메타데이터가 없으면 회원 생성이 실패한다. 교사 인증을 만들기 전에 다음 중 하나로 변경해야 한다.

- `role = student` 메타데이터가 있을 때만 학생 프로필 생성
- 교사/학생 가입 흐름별 트리거 분리
- 통합 `profiles` 테이블과 역할별 세부 테이블로 재설계

#### `public.lesson_progress`

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `user_id` | uuid | 학생 Auth ID |
| `lesson_no` | smallint | 1~10 |
| `current_step` | smallint | 현재 단계 |
| `quiz_score` | smallint nullable | 퀴즈 점수 |
| `reflection` | text | 성찰 문장 |
| `completed` | boolean | 차시 완료 여부 |
| `created_at` | timestamptz | 생성 시각 |
| `updated_at` | timestamptz | 갱신 시각 |

복합 기본키:

```text
(user_id, lesson_no)
```

RLS:

- 자신의 진도만 SELECT 가능
- 자신의 `user_id`로만 INSERT 가능
- 자신의 진도만 UPDATE 가능
- DELETE 정책은 없음

### Supabase에서 실제 확인된 항목

- 익명 인증 활성화 상태에서 익명 사용자 발급 성공을 확인했으나, 이후 익명 로그인은 비활성화했다.
- `lesson_progress` 테이블에 인증 사용자로 접근 가능한 것을 확인했다.
- 학생 프로필 스키마와 트리거 SQL 실행 결과 `Success. No rows returned`를 확인했다.
- 실제 이메일을 사용하는 테스트 학생 계정은 생성하지 않았다. 불필요한 테스트 계정과 이메일 발송을 피하기 위해서다.

---

## 6. 현재 라우트와 화면

### `/login`

파일:

```text
web/app/login/page.tsx
```

학생용 회원가입과 로그인 화면이다.

회원가입 입력:

- 이름
- 반
- 번호
- 이메일
- 비밀번호
- 비밀번호 확인

회원가입 호출:

```ts
supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      student_name,
      grade: 6,
      class_no,
      student_no,
    },
  },
})
```

로그인 호출:

```ts
supabase.auth.signInWithPassword({ email, password })
```

이메일 확인이 켜져 있으므로 가입 직후 `session`이 없으면 확인 이메일 안내를 표시한다.

이미 로그인한 일반 학생은 `/`로 이동한다. 익명 사용자는 일반 학생 세션으로 인정하지 않는다.

### `/`

파일:

```text
web/app/page.tsx
```

학생 대시보드다.

현재 동작:

- `useStudentSession()`으로 로그인 확인
- 미로그인 시 `/login`으로 이동
- 학생 이름, 반, 번호 표시
- 로그아웃 버튼 제공
- 1차시와 2차시 링크 제공
- 교사 화면 링크 제거

아직 정적 데이터인 항목:

- 전체 진도 10%
- “1차시를 배우고 있어요” 문구
- 차시 상태(current/open/locked)
- 배지 상태
- 앱 보관함과 피드백

이 항목들은 `lesson_progress`를 조회해 동적으로 계산해야 한다.

### `/lesson/1`

파일:

```text
web/app/lesson/1/page.tsx
```

실제 수업 콘텐츠가 가장 완성된 차시다.

구성:

1. 가은이의 로봇 명령 선택
2. 기계어 → 어셈블리어 → C 등 고급 언어 → 블록 코딩 → AI 코딩 타임라인
3. 롤러코스터 타이쿤 사례
4. 주스 따르기 명령 순서 활동
5. 2문항 퀴즈와 한 문장 성찰

롤러코스터 타이쿤 공식 링크:

```text
https://www.chrissawyergames.com/faq.htm
```

사이트에는 FAQ에서 `Chris Sawyer / Game Development`를 선택하도록 안내한다. 내용은 게임 코드의 99%가 x86 어셈블리어이며 Windows/DirectX 연결의 작은 부분에 C를 사용했다는 공식 설명에 기반한다.

저장 데이터:

- 현재 단계
- 퀴즈 점수
- 성찰 문장
- 완료 여부

완료 조건:

- 퀴즈 2문항 모두 정답
- 성찰 문장 10자 이상

로그인하지 않은 사용자는 `/login`으로 이동한다.

### `/lesson/2`

파일:

```text
web/app/lesson/2/page.tsx
```

전통 코딩과 AI 코딩 비교 수업의 UI 시제품이다. 로그인 보호는 적용되었지만, 화면에 “자동 저장됨”이라고 표시되는 것과 달리 Supabase 저장은 아직 구현되지 않았다.

### `/teacher`

파일:

```text
web/app/teacher/page.tsx
```

초기 교사용 대시보드 목업이며 데이터는 하드코딩되어 있다. 교사 인증과 실제 데이터 연결은 없다. 학생 UI에서는 링크를 제거했지만 주소를 직접 입력하면 화면을 볼 수 있다.

사용자가 명시적으로 “교사용 계정은 아직 구현하지 말라”고 했다. 따라서 다음 세션에서 교사 기능을 자의적으로 확장하지 않는다. 다만 공개 목업 노출을 막기 위해 `/teacher`를 임시 안내 화면으로 바꾸거나 라우트를 제거할지는 사용자와 상의할 수 있다.

---

## 7. 주요 코드 인터페이스

### Supabase 클라이언트

파일:

```text
web/lib/supabase.ts
```

내보내기:

```ts
export const isSupabaseConfigured: boolean
export const supabase: SupabaseClient | null
```

환경변수:

```ts
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
```

Auth 설정:

```ts
{
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
}
```

### 학생 인증 훅과 함수

파일:

```text
web/lib/student-auth.ts
```

타입:

```ts
export type StudentProfile = {
  user_id: string;
  student_name: string;
  grade: number;
  class_no: number;
  student_no: number;
};
```

훅:

```ts
useStudentSession(): {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
}
```

동작:

- `supabase.auth.getUser()`로 현재 사용자 검증
- 사용자 없음 또는 익명 사용자이면 `/login` 이동
- 일반 사용자면 `student_profiles`에서 자신의 프로필 조회
- `SIGNED_OUT` 이벤트에서 `/login` 이동

함수:

```ts
signOutStudent(): Promise<void>
koreanAuthError(message: string): string
```

### 차시 진도 API

파일:

```text
web/lib/lesson-progress.ts
```

타입:

```ts
export type LessonProgress = {
  lessonNo: number;
  currentStep: number;
  quizScore: number | null;
  reflection: string;
  completed: boolean;
};
```

함수:

```ts
loadLessonProgress(lessonNo: number): Promise<LessonProgress | null>
saveLessonProgress(progress: LessonProgress): Promise<void>
```

두 함수 모두 `supabase.auth.getUser()`로 이메일·비밀번호 학생인지 확인한다. 사용자가 없거나 익명 사용자면 오류를 낸다.

---

## 8. 현재 알려진 문제와 기술 부채

### 높은 우선순위

1. **Supabase Site URL/Redirect URL 미검증**
   - 이메일 확인 링크가 실제 사이트로 돌아오는지 반드시 확인해야 한다.

2. **실제 학생 회원가입 E2E 미검증**
   - 실제 이메일 가입 → 확인 링크 → 로그인 → 프로필 표시 → 진도 저장의 전체 흐름을 한 번 시험해야 한다.

3. **1차시 단계 자동 저장의 stale state 가능성**
   - 다음 단계 버튼에서 `setStep(nextStep)` 직후 `saveCurrentProgress(false)`를 호출한다.
   - `saveCurrentProgress`가 이전 렌더의 `step` 값을 사용할 수 있어 DB에 한 단계 이전 값이 저장될 수 있다.
   - 저장 함수가 명시적으로 `nextStep`을 받도록 수정하는 편이 안전하다.

4. **1차시 복원 범위 불완전**
   - 서버에서 현재 단계와 성찰 문장은 복원한다.
   - 퀴즈 답안, `quizChecked`, 명령 순서 활동 결과는 복원하지 않는다.
   - DB에는 퀴즈 점수만 저장하며 개별 답안은 저장하지 않는다.

5. **홈 대시보드 진도 하드코딩**
   - DB의 완료 차시를 읽어 전체 진도와 현재 차시를 계산해야 한다.

6. **2차시 저장 미구현**
   - “자동 저장됨” 문구가 실제 기능과 불일치한다.

### 인증·개인정보 관련

7. **README의 기존 개인정보 원칙과 실제 구현 충돌**
   - README 상단에는 “학생 이메일을 수집하지 않는다”, “학급 코드·번호·PIN”이라는 초기 기획이 남아 있다.
   - 현재 구현은 이메일·비밀번호 인증이다.
   - PRD와 README 전체를 현재 결정에 맞춰 갱신하거나, 학교 운영 정책에 따라 다시 PIN 방식으로 전환할지 결정해야 한다.

8. **비밀번호 재설정 없음**
   - `resetPasswordForEmail` 기반 “비밀번호를 잊었어요” 기능이 없다.

9. **계정 삭제·학생 정보 수정 없음**
   - 학생 프로필 RLS에 UPDATE/DELETE 정책도 없다.
   - 운영 전에 교사 관리 기능 또는 관리자 절차가 필요하다.

10. **회원가입 남용 방지 미구현**
    - 익명 로그인은 껐지만 CAPTCHA와 가입 코드 제한은 없다.
    - 공개 사이트이므로 외부인이 이메일 계정을 만들 수 있다.
    - 학급 가입 코드, 허용 이메일 도메인, CAPTCHA 등의 정책을 정해야 한다.

11. **교사 계정 추가 전 트리거 수정 필수**
    - 현재 신규 Auth 사용자는 모두 학생으로 간주된다.

### 화면과 접근 제어

12. **로그인 보호는 클라이언트 리다이렉트**
    - `/`, `/lesson/1`, `/lesson/2`의 HTML/JS 자체는 공개된다.
    - 민감 데이터는 RLS로 보호되므로 직접 데이터 유출은 막히지만, 서버 측 라우트 보호는 아니다.

13. **`/teacher` 목업 공개 노출**
    - 가짜 데이터뿐이지만 직접 URL로 접근 가능하다.

14. **프로필 조회 실패 상태 부족**
    - 로그인 사용자는 있는데 `student_profiles` 행이 없으면 홈은 기본값 `학생`, `-반`, `-번`으로 보일 수 있다.
    - 오류 안내 또는 프로필 복구 흐름이 필요하다.

15. **네트워크 오류 UX 부족**
    - 저장 실패 시 “저장 확인 필요” 정도만 표시한다.
    - 재시도 버튼, 로컬 임시 보관, 오프라인 복구는 없다.

---

## 9. 다음 작업 권장 순서

### A. 인증 흐름 안정화

- [ ] Supabase Site URL과 Redirect URL을 공개 주소로 설정
- [ ] 실제 테스트 학생 계정 1개 생성
- [ ] 확인 이메일 링크 동작 확인
- [ ] 로그인 후 프로필 이름·반·번호 표시 확인
- [ ] 로그아웃 후 보호 페이지 접근 차단 확인
- [ ] 비밀번호 재설정 화면 구현
- [ ] 가입 남용 방지 정책 결정

### B. 1차시 저장 완성

- [ ] 다음 단계 저장 시 최신 `nextStep`이 저장되도록 수정
- [ ] 새로고침 후 단계·성찰·완료 상태 복원 확인
- [ ] 완료한 차시가 홈에서 완료 상태로 표시되도록 연결
- [ ] 필요하다면 퀴즈 답안과 활동 상태 저장 컬럼 또는 JSONB 설계
- [ ] 저장 실패 재시도 UX 추가

### C. 학생 대시보드 실데이터화

- [ ] `lesson_progress` 전체 조회 함수 추가
- [ ] 전체 진도 계산
- [ ] 현재 차시 자동 결정
- [ ] 완료/진행 중/열림/잠김 상태 계산 방식 정의
- [ ] 학생 배지 상태 DB 연결

### D. 수업 콘텐츠 확장

- [ ] 2차시 실제 저장 구현
- [ ] 3차시 콘텐츠 구현
- [ ] 4차시 콘텐츠 구현
- [ ] 5~6차시 Canva AI 코드 단일 기능 앱 수업 구현
- [ ] 7~8차시 다기능 앱 수업 구현
- [ ] 9~10차시 개인 앱 제작·공유·성찰 구현

### E. 결과물 저장 구조

- [ ] Canva 공유 URL 제출 테이블 설계
- [ ] 앱 기획서와 프롬프트 기록 테이블 설계
- [ ] 오류 수정 이력 저장
- [ ] 학생 작품 공유 범위 결정

### F. 교사 기능 — 사용자 승인 전 보류

- [ ] 현재는 구현하지 않음
- [ ] 추후 시작 전 역할 모델과 교사 인증 방식 재설계
- [ ] `handle_new_student` 트리거를 역할 인식형으로 변경
- [ ] 교사만 학급 데이터를 조회할 수 있는 RLS 또는 서버 API 설계

### G. 문서와 저장소

- [ ] README의 초기 기획과 현재 구현 불일치 정리
- [ ] PRD 인증 방식을 이메일·비밀번호 기준으로 갱신할지 결정
- [ ] 현재 미커밋 변경을 GitHub에 커밋·푸시
- [ ] 운영용 개인정보 처리 및 계정 정책 문서 작성

---

## 10. 다음 세션 시작 체크리스트

1. 이 문서를 먼저 읽는다.
2. 작업공간 루트에서 `git status --short`를 확인한다.
3. 사용자 변경을 보존하고 현재 미커밋 파일을 임의로 되돌리지 않는다.
4. `web/.env.local`이 존재하는지 확인하되 값을 출력하거나 커밋하지 않는다.
5. `npm run build`로 현재 기준이 유지되는지 확인한다.
6. Supabase 관련 작업이면 실제 프로젝트 설정과 `web/supabase/schema.sql`을 함께 확인한다.
7. Sites 수정 작업이면 해당 세션에 설치된 최신 Sites skills를 다시 읽는다.
8. 공개 배포 전에 접근 모드가 `public`임을 사용자에게 알리고 승인을 받는다.
9. 교사 계정은 사용자의 새 지시 없이는 구현하지 않는다.

---

## 11. 핵심 파일 지도

```text
.
├─ PRD.md                         # 초기 제품 요구사항
├─ README.md                      # 프로젝트 설명, 일부 내용은 현재 구현과 불일치
├─ SESSION_HANDOFF.md             # 이 인수인계 문서
└─ web/
   ├─ .env.local                  # 실제 Supabase 공개 설정, Git 제외
   ├─ .env.example                # 환경변수 예시
   ├─ .openai/hosting.json        # Sites 프로젝트 연결
   ├─ app/
   │  ├─ layout.tsx               # 전역 메타데이터와 레이아웃
   │  ├─ globals.css              # 테마와 공통 스타일
   │  ├─ page.tsx                 # 학생 홈 대시보드
   │  ├─ login/page.tsx           # 학생 회원가입·로그인
   │  ├─ lesson/1/page.tsx        # 완성도가 높은 1차시
   │  ├─ lesson/2/page.tsx        # 2차시 시제품
   │  └─ teacher/page.tsx         # 인증 없는 교사용 목업
   ├─ lib/
   │  ├─ supabase.ts              # Supabase 클라이언트
   │  ├─ student-auth.ts           # 학생 세션·프로필·로그아웃
   │  └─ lesson-progress.ts        # 진도 조회·저장
   ├─ supabase/
   │  └─ schema.sql               # 실제 적용된 DB 스키마와 RLS
   ├─ package.json
   └─ package-lock.json
```

---

## 12. 결정 기록

- 데이터베이스는 OpenAI가 제공하는 DB가 아니라 사용자가 만든 Supabase 프로젝트를 사용한다.
- 초기에 로컬 저장만 고려했으나 여러 기기와 학생이 사용해야 하므로 Supabase 영속 저장으로 전환했다.
- 사이트 자체는 ChatGPT 계정 로그인 없이 공개 접근 가능해야 한다.
- 학생 데이터 접근은 사이트 접근 정책이 아니라 학생 Supabase 계정과 RLS로 통제한다.
- 처음에는 Supabase 익명 인증을 연결했으나, 이후 사용자 요구에 따라 실제 이메일·비밀번호 학생 계정으로 전환했다.
- 익명 로그인은 최종적으로 비활성화했다.
- 이메일 확인은 활성화 상태로 유지했다.
- 교사용 계정과 권한은 명시적으로 보류했다.
- 학생 프로필은 6학년, 반, 번호, 이름을 저장한다.
- 학생은 자신의 프로필과 진도만 읽거나 수정할 수 있다.
- 1차시 콘텐츠에서 롤러코스터 타이쿤 출처 링크는 Chris Sawyer 공식 FAQ 인덱스로 수정했다.

이 문서의 정보와 실제 코드 또는 Supabase 상태가 다를 경우, 실제 코드와 운영 설정을 우선 확인하고 문서를 갱신한다.
