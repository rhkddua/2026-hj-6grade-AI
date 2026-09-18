# AI 코딩 교실 웹사이트 — 세션 인수인계

> 최종 갱신: 2026-09-18 (KST)  
> 다음 세션의 핵심 목표: **3차시 「AI는 무엇을 잘하고 못할까?」 구현, 저장·복원 연결, 검증, 공개 배포**

## 1. 새 세션에서 가장 먼저 할 일

1. 이 문서를 끝까지 읽는다.
2. Sites 전용 지침인 `web/AGENTS.md`를 읽고 이 사이트의 구현·검증·배포 절차에 적용한다.
3. 작업 루트를 `C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web`으로 둔다.
4. `git status --short`로 아래 미커밋 변경이 그대로인지 확인한다. 사용자 변경을 reset/checkout으로 버리지 않는다.
5. 기존 2차시 구현 패턴을 읽는다.
   - `web/app/lesson/2/page.tsx`
   - `web/app/lesson/2/content.tsx`
   - `web/lib/lesson-two.ts`
   - `web/lib/lesson-progress.ts`
6. 3차시를 같은 구조로 구현한다.
7. `npm run lint`와 `npm run build`를 실행한다.
8. 로그인한 학생 계정으로 3차시 저장·새로고침 복원·완료 조건을 E2E 확인한다.
9. 현재 설치된 Sites 스킬 지침에 따라 기존 Sites 프로젝트에 재배포한다.

## 2. 프로젝트 개요

초등학교 6학년 대상 10차시 AI 코딩 수업 웹 플랫폼이다. 학생은 차시별 설명, 비교 체험, 퀴즈, 성찰 활동을 수행하고 Supabase에 진도를 저장한다. 후반 차시에는 Canva AI 코드로 앱을 제작할 계획이다.

현재 구현된 범위:

- 학생용 홈과 10차시 목록 UI
- 1차시 「코딩은 어떻게 발전해 왔을까?」
- 2차시 「전통적인 코딩과 AI 코딩」 전체 활동, 자동 저장, 복원, 완료 처리
- 학생 로그인 전용 화면
- Supabase Authentication, 학생 프로필, 차시 진도, 활동 JSON 저장
- 애플리케이션 수준 `super_admin` 역할과 RLS
- OpenAI Sites 공개 배포

현재 공개 사이트:

- <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>

## 3. 저장소와 Git 상태

로컬 상위 저장소:

```text
C:\Users\rhkdd\OneDrive\문서\2학기 전학공
```

웹 프로젝트:

```text
C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web
```

GitHub:

- <https://github.com/rhkddua/2026-hj-6grade-AI>
- 브랜치: `main`
- 현재 확인된 HEAD: `efea6e3 Persist lesson 2 activities and completion progress`

2026-09-18 현재 상위 저장소의 미커밋 변경:

```text
 M web/app/login/page.tsx
 M web/lib/student-auth.ts
 M web/supabase/schema.sql
?? web/lib/auth-errors.ts
?? web/supabase/migrations/20260917_allow_admin_created_students.sql
?? web/supabase/migrations/20260917_staff_roles.sql
```

이 변경은 학생 직접 가입 제거, 교사가 생성하는 계정 지원, 인증 오류 문구 개선, 최고관리자 역할 추가에 해당한다. 다음 세션에서 3차시 작업을 시작하기 전에 삭제하거나 되돌리지 않는다. 필요하면 현재 변경과 3차시 구현을 의미 있는 단위로 나누어 커밋한다.

`web` 내부에 중첩 `.git`을 남기지 않는다. Sites 배포 때문에 임시 중첩 저장소를 만들었다면 배포 후 `web/.git`과 임시 패키지 파일을 제거하고 상위 저장소의 추적 상태를 다시 확인한다.

## 4. 기술 스택과 검증 명령

- React 19.2
- TypeScript 5.9
- Vinext `1.0.0-beta.5`
- Vite 8
- Tailwind CSS 4
- Shadcn 기반 컴포넌트
- Supabase JS `^2.116.0`
- Supabase Auth + PostgreSQL + RLS
- OpenAI Sites / Cloudflare Workers

주요 명령:

```powershell
cd "C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web"
npm install
npm run dev
npm run lint
npm run build
```

2026-09-18 확인 결과:

- `npm run lint`: 오류 출력 없이 완료
- `npm run build`: exit code 0
- 빌드 라우트: `/`, `/login`, `/lesson/1`, `/lesson/2`, `/teacher`

3차시 구현 후 `/lesson/3`가 빌드 결과에 추가되어야 한다.

## 5. OpenAI Sites 배포 상태

- Sites 프로젝트 ID: `appgprj_6a962dcd21f08191876edad89331f7c3`
- 슬러그: `hj-ai-coding-class-2026`
- 사이트 제목: `AI 코딩 교실`
- 접근 모드: `public`
- 공개 URL: <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>
- 현재 알려진 최신 배포: **version 7**, 성공
- 설정 파일: `web/.openai/hosting.json`

```json
{
  "project_id": "appgprj_6a962dcd21f08191876edad89331f7c3",
  "d1": null,
  "r2": null
}
```

Sites 운영 환경 변수:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

`service_role` 키는 사용하지 않는다. 실제 공개 설정값은 `web/.env.local`에 있으며 Git 제외 대상이다. 비밀값을 인수인계 문서나 커밋에 복사하지 않는다.

재배포할 때는 그 세션에 설치된 `sites:sites-building`과 `sites:sites-hosting`의 `SKILL.md`를 다시 읽는다. 기존 공개 사이트의 새 버전으로 배포하고, 새 프로젝트를 만들지 않는다.

## 6. Supabase 상태

프로젝트:

- Project ref: `ujhcwxscxepbttqcysal`
- Project URL: `https://ujhcwxscxepbttqcysal.supabase.co`

### 인증 운영 방식

- Email provider 활성화
- 사용자가 Supabase에서 이메일 인증을 요구하지 않도록 설정함
- 웹사이트의 학생 직접 회원가입 UI는 제거됨
- 학생 계정은 교사가 Supabase Authentication에서 별도로 생성함
- `/login`은 이메일·비밀번호 로그인만 제공함

관리자 화면에서 Auth 사용자만 만들면 학생 정보가 자동으로 생기지 않는다. 학생 계정은 Auth 생성 후 `student_profiles`에 같은 `user_id`로 이름·반·번호를 별도 입력해야 한다. `handle_new_student()`는 학생 메타데이터가 없는 관리자 생성 계정에서는 프로필 삽입을 건너뛰도록 수정되었다.

### 데이터베이스 구조

스키마 원본:

```text
web/supabase/schema.sql
```

적용한 마이그레이션:

```text
web/supabase/migrations/20260917_lesson_activity_data.sql
web/supabase/migrations/20260917_allow_admin_created_students.sql
web/supabase/migrations/20260917_staff_roles.sql
```

세 마이그레이션 모두 원격 Supabase에 적용된 상태다.

#### `student_profiles`

- `user_id uuid` PK, `auth.users.id` 참조
- `student_name text`
- `grade smallint`, 6만 허용
- `class_no smallint`, 1~20
- `student_no smallint`, 1~50
- `(grade, class_no, student_no)` unique
- 학생은 본인 프로필만 SELECT 가능
- 최고관리자는 전체 CRUD 가능

#### `lesson_progress`

- 복합 PK: `(user_id, lesson_no)`
- `lesson_no`: 1~10
- `current_step`: 현재 단계
- `quiz_score`: 차시 퀴즈 점수
- `reflection`: 성찰문
- `completed`: 완료 여부
- `activity_data jsonb`: 차시별 세부 선택·답안·활동 상태
- `created_at`, `updated_at`
- 학생은 자신의 행만 SELECT/INSERT/UPDATE 가능
- 학생 DELETE 정책은 없음
- 최고관리자는 전체 CRUD 가능

3차시는 새 테이블을 만들지 말고 우선 `lesson_progress`의 `lesson_no = 3`과 `activity_data`를 사용한다.

#### `staff_profiles`

- `user_id uuid` PK
- `display_name`
- `role`: `teacher` 또는 `super_admin`
- RLS 활성화
- `public.is_super_admin()`으로 최고관리자 여부 확인

### 최고관리자 계정

- 계정 이메일: `superadmin@hj-ai-class.com`
- 표시 이름: `최고관리자`
- 역할: `super_admin`
- Auth 이메일 확인 상태와 `raw_app_meta_data.role`, `staff_profiles.role`이 모두 정상임을 SQL로 확인함
- 사이트 로그인 성공을 확인함
- 비밀번호는 이 문서에 기록하지 않음

사용자가 마지막으로 비밀번호 변경을 요청했고, Supabase SQL Editor에 새 비밀번호를 직접 입력해 실행하도록 화면을 넘겼다. **사용자가 실제로 Run을 눌렀는지는 이 세션에서 검증하지 못했다.** 다음 세션에서는 필요할 때 사용자에게 현재 비밀번호를 묻지 말고, 로그인 성공 여부만 확인하거나 Supabase Auth의 최신 상태를 확인한다.

이 계정은 애플리케이션 DB/RLS 수준 최고관리자다. Supabase 프로젝트 소유자, Dashboard 관리자 또는 `service_role` 권한은 아니다.

## 7. 현재 라우트와 코드 구조

### `/login`

- 파일: `web/app/login/page.tsx`
- 학생 직접 가입 기능 제거
- 교사가 배부한 이메일과 비밀번호로만 로그인
- Supabase 오류를 `web/lib/auth-errors.ts`에서 한국어로 변환
- 네트워크 예외 처리 포함

### `/`

- 파일: `web/app/page.tsx`
- `useStudentSession()`으로 인증 확인
- 학생 이름·반·번호 표시
- 1·2차시 링크만 활성화
- 3차시는 현재 잠김/비활성 상태이므로 구현 후 링크와 상태를 수정해야 함
- 전체 진도 10%, 현재 차시, 배지 등은 아직 하드코딩

### `/lesson/1`

- 파일: `web/app/lesson/1/page.tsx`
- 코딩 언어 발전 과정, 로봇 명령, 명령 순서 활동, 2문항 퀴즈, 성찰
- 진도·퀴즈 점수·성찰·완료 저장
- 2차시보다 오래된 구현이므로 3차시 설계의 주 기준으로 삼지 않는다.

### `/lesson/2`

핵심 파일:

```text
web/app/lesson/2/page.tsx
web/app/lesson/2/content.tsx
web/lib/lesson-two.ts
web/lib/lesson-progress.ts
```

5단계 구성:

1. 같은 목표, 다른 코딩 방법
2. 텍스트·블록·AI 코딩으로 “안녕!” 세 번 실행 체험
3. 특징 분류 6개
4. 세 방법 비교 문장 작성
5. 3문항 퀴즈와 성찰

완료 조건:

- 세 방법 실행 완료
- 특징 분류 6개 모두 정답 확인
- 비교 문장 3개가 각각 10자 이상
- 퀴즈 3문항 모두 정답 확인
- 성찰 10자 이상

저장 구현의 핵심:

- 800ms 디바운스 자동 저장
- Promise queue로 저장 순서 보장
- revision 번호로 늦게 끝난 저장이 최신 상태를 덮지 않게 처리
- `beforeunload`에서 미저장 변경 경고
- 저장 실패 재시도
- 로드 실패 시 기존 기록 보호를 위해 활동을 시작시키지 않고 재시도 화면 표시
- `activity_data` 전체 복원
- 완료 후 다시 수정하면 `completed`를 false로 되돌림

3차시는 이 저장 패턴을 재사용한다. 공통 훅으로 추출해도 되지만, 3차시 완성보다 리팩터링 범위를 키우지 않는다.

### `/teacher`

- 파일: `web/app/teacher/page.tsx`
- 하드코딩된 초기 목업
- 인증·역할 검사·실데이터 연결 없음
- 직접 URL 접근 가능
- 최고관리자 역할은 DB에만 있고 관리자 전용 UI는 아직 없음

이번 다음 세션의 우선 목표는 3차시다. 교사/관리자 화면 확장은 사용자가 별도로 요청하지 않으면 범위를 넓히지 않는다.

## 8. 공통 코드 인터페이스

### `web/lib/supabase.ts`

```ts
export const isSupabaseConfigured: boolean
export const supabase: SupabaseClient | null
```

환경변수는 `import.meta.env.VITE_*`를 사용한다.

### `web/lib/student-auth.ts`

```ts
useStudentSession(): {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
}

signOutStudent(): Promise<void>
```

현재 훅은 로그인 사용자의 `student_profiles`를 조회한다. 최고관리자처럼 학생 프로필이 없는 사용자가 사이트에 로그인하면 기본 학생 UI가 보일 수 있다. 3차시 작업 중 이 동작을 억지로 수정하지 말고 별도 관리 UI 작업으로 남긴다.

### `web/lib/lesson-progress.ts`

```ts
type LessonProgress = {
  lessonNo: number;
  currentStep: number;
  quizScore: number | null;
  reflection: string;
  completed: boolean;
  activityData?: Record<string, unknown>;
}

loadLessonProgress(lessonNo, includeActivities?): Promise<LessonProgress | null>
saveLessonProgress(progress): Promise<void>
```

3차시는 `loadLessonProgress(3, true)`와 `saveLessonProgress({ lessonNo: 3, ... })`를 사용한다.

## 9. 3차시 구현 목표와 권장 설계

대시보드에 이미 정해진 제목은 **「AI는 무엇을 잘하고 못할까?」**다. 6학년 학생이 AI의 강점과 한계를 구분하고, AI 결과를 사람이 확인해야 하는 이유와 개인정보 보호 원칙을 설명할 수 있게 한다.

권장 5단계:

1. **생각 열기** — “AI라면 잘할까?” 사례에 첫 판단 남기기
2. **AI가 잘하는 일** — 많은 예시에서 패턴 찾기, 분류·요약·아이디어 제안 체험
3. **AI가 어려워하는 일** — 최신 사실, 맥락·감정, 모호한 지시, 틀린 답을 그럴듯하게 말하는 사례 판별
4. **사람의 확인과 안전** — 사실 확인 방법 고르기, 개인정보를 넣지 않는 선택 활동
5. **배움 확인** — 3문항 퀴즈와 “AI 답을 받은 뒤 내가 해야 할 일” 성찰

최소 구현 파일:

```text
web/app/lesson/3/page.tsx
web/app/lesson/3/content.tsx
web/lib/lesson-three.ts
```

권장 `LessonThreeActivities` 예시:

```ts
type LessonThreeActivities = {
  opening: number | null;
  strengthChoices: Array<number | null>;
  strengthChecked: boolean;
  limitationChoices: Array<number | null>;
  limitationChecked: boolean;
  verificationChoices: Array<number | null>;
  verificationChecked: boolean;
  answers: Array<number | null>;
  quizChecked: boolean;
};
```

완료 조건은 답을 한 번 선택하는 것만으로 끝내지 않는다. 권장 조건:

- 강점 분류 정답 확인
- 한계 사례 분류 정답 확인
- 사실 확인·개인정보 안전 활동 정답 확인
- 퀴즈 3문항 모두 정답
- 성찰 10자 이상

콘텐츠 원칙:

- AI를 의인화하거나 “생각한다/안다”고 단정하지 않는다.
- AI는 항상 틀린다거나 항상 맞는다는 식으로 가르치지 않는다.
- “그럴듯한 오답”, 최신 정보 한계, 출처 확인 필요성을 초등학생 언어로 설명한다.
- 실제 학생 이름, 전화번호, 주소, 계정정보를 입력하게 하는 활동을 만들지 않는다.
- 정답 피드백은 틀렸다는 표시만 하지 말고 이유와 다시 확인할 단서를 준다.
- 모바일과 키보드 접근성을 2차시 수준으로 유지한다.

홈 수정:

- `web/app/page.tsx`에서 3차시 링크를 `/lesson/3`으로 활성화한다.
- 3차시 구현만으로 전체 진도 계산을 전면 개편할 필요는 없다. 다만 3차시를 여전히 “잠김”으로 보이게 두지 않는다.

## 10. 3차시 검증 체크리스트

- [ ] 미로그인 상태에서 `/lesson/3` 접근 시 `/login` 이동
- [ ] 로그인 후 5단계 이동 가능
- [ ] 각 선택/답안/성찰이 800ms 후 저장 상태로 바뀜
- [ ] 새로고침 후 현재 단계와 모든 `activity_data` 복원
- [ ] 오답 상태에서는 완료 불가
- [ ] 정답 확인과 성찰 10자 조건 충족 후 완료 가능
- [ ] 완료 행의 `lesson_no = 3`, `quiz_score`, `reflection`, `completed = true` 확인
- [ ] 완료 후 답을 수정하면 완료 상태 해제
- [ ] 저장 실패 시 오류 문구와 재시도 버튼 표시
- [ ] 모바일 너비에서 가로 넘침이나 잘린 버튼 없음
- [ ] 키보드로 라디오·버튼·단계 이동 가능
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과, `/lesson/3` 라우트 확인
- [ ] 공개 배포 후 실제 URL에서 로그인·저장·복원 확인

## 11. 알려진 문제와 범위 주의사항

1. 홈의 전체 진도와 차시 상태는 DB와 아직 연결되지 않았다.
2. `/teacher`는 공개 목업이며 역할 검사가 없다.
3. 최고관리자 UI는 없다. 권한은 Supabase RLS에만 적용되어 있다.
4. 학생 Auth 계정과 `student_profiles`를 교사가 별도로 맞춰 만들어야 한다.
5. 비밀번호 재설정 UI가 없다.
6. 1차시의 세부 활동 복원은 2차시만큼 완전하지 않다.
7. 네트워크 장애 시 로컬 오프라인 저장은 없다.
8. 로그인 보호는 클라이언트 리다이렉트이고, 민감 데이터 보호는 RLS에 의존한다.
9. README의 오래된 인증 설명이 현재 교사 생성형 계정 방식과 다를 수 있으므로 추후 정리해야 한다.
10. 최고관리자 비밀번호 변경 완료 여부는 미검증이다. 비밀번호 자체는 파일에 기록하지 않는다.

3차시 구현 중 위 문제를 모두 한꺼번에 해결하지 않는다. 3차시의 콘텐츠, 저장·복원, 완료 처리, 접근성, 빌드와 배포를 먼저 완성한다.

## 12. 다음 세션 완료 기준

다음 조건을 모두 만족하면 3차시 작업이 완료된 것이다.

- `/lesson/3`에 수업 내용과 상호작용이 구현됨
- 학생별 자동 저장과 새로고침 복원이 동작함
- 퀴즈·성찰·완료 조건이 실제 DB에 저장됨
- 홈에서 3차시 진입 가능
- lint/build 통과
- 공개 Sites 프로젝트에 새 버전 배포 성공
- 공개 URL에서 로그인 후 3차시 E2E 검증 완료
- 변경 파일과 원격 Supabase 변경 사항이 이 문서 또는 커밋 메시지에 반영됨
