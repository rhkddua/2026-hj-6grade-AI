# AI 코딩 교실 웹사이트 — 세션 인수인계

> 최종 갱신: 2026-09-18 (KST)  
> 다음 세션 핵심 목표: **4차시 「AI에게 잘 지시하는 방법」 구현, 저장·복원 검증, 기존 공개 사이트 재배포**

## 1. 새 세션에서 바로 할 일

1. 이 문서를 끝까지 읽는다.
2. 작업 루트를 `C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web`으로 둔다.
3. `web/AGENTS.md`와 그 세션에 설치된 `sites:sites-building`, `sites:sites-hosting` 지침을 읽는다.
4. 상위 저장소에서 `git status --short`를 실행하고 사용자 변경을 reset/checkout하지 않는다.
5. 3차시 구현 패턴을 우선 읽는다.
   - `web/app/lesson/3/page.tsx`
   - `web/app/lesson/3/content.tsx`
   - `web/lib/lesson-three.ts`
   - `web/lib/lesson-progress.ts`
6. 같은 구조로 4차시를 구현하고 홈에서 `/lesson/4`를 연다.
7. `npm run build`를 실행한다. lint는 아래의 기존 오류 상태를 참고한다.
8. 로그인한 테스트 계정으로 저장·새로고침 복원·완료 해제까지 확인한다.
9. 기존 Sites 프로젝트에 새 버전으로 재배포한다. 새 사이트를 만들지 않는다.
10. 배포용으로 `web/.git`을 임시 생성했다면 배포 후 반드시 제거하고 상위 저장소 상태를 확인한다.

## 2. 프로젝트 요약

초등학교 6학년 대상 10차시 AI 코딩 수업 웹 플랫폼이다. 학생은 차시별 설명, 선택 활동, 퀴즈와 성찰을 수행하고 Supabase에 학습 진도를 저장한다.

현재 구현됨:

- 학생용 홈과 10차시 목록
- 1차시 「코딩은 어떻게 발전해 왔을까?」
- 2차시 「전통적인 코딩과 AI 코딩」
- 3차시 「AI는 무엇을 잘하고 못할까?」
- 이메일·비밀번호 학생 로그인
- Supabase Authentication, 학생 프로필, 차시 진도와 활동 JSON 저장
- 애플리케이션 수준 `super_admin` 역할과 RLS
- OpenAI Sites 공개 배포

공개 사이트:

- <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>

## 3. 저장소와 현재 상태

상위 Git 저장소: `C:\Users\rhkdd\OneDrive\문서\2학기 전학공`

웹 프로젝트: `C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web`

GitHub:

- <https://github.com/rhkddua/2026-hj-6grade-AI>
- 브랜치: `main`
- 2026-09-18 확인 HEAD: `e38d34b`
- 문서 갱신 직전 `git status --short`: 깨끗함

주의:

- `web` 내부의 임시 중첩 `.git`은 3차시 배포 후 제거했다.
- Sites 배포 시 소스 저장소가 별도 이력을 가지므로 임시 `web/.git`이 필요할 수 있다.
- 임시 중첩 저장소를 만든 경우 배포가 끝나면 제거한다.
- `.env.local`의 실제 키를 출력하거나 문서·커밋에 넣지 않는다.

## 4. 기술 스택과 검증

- React 19.2, TypeScript 5.9
- Vinext `1.0.0-beta.5`, Vite 8
- Tailwind CSS 4, Shadcn 기반 컴포넌트
- Supabase JS `^2.116.0`
- OpenAI Sites / Cloudflare Workers

```powershell
cd "C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web"
npm run dev
npm run lint
npm run build
```

3차시 결과:

- `npm run build`: 성공
- 라우트: `/`, `/login`, `/lesson/1`, `/lesson/2`, `/lesson/3`, `/teacher`
- 미로그인 `/lesson/3` 접근 시 `/login` 이동 확인
- `npm run lint`: 프로젝트 전체의 기존 오류 때문에 실패

lint에는 기존 Shadcn 접근성 규칙, React Compiler 규칙, `import.meta.env` 타입, `ProgressValue` 사용, deprecated API 등이 포함된다. 4차시에서는 새 오류를 늘리지 않는 것을 우선하고 전체 lint 정리는 별도 범위로 둔다. build 실패는 반드시 수정한다.

## 5. Sites 배포 상태

- 프로젝트 ID: `appgprj_6a962dcd21f08191876edad89331f7c3`
- 슬러그: `hj-ai-coding-class-2026`
- 제목: `AI 코딩 교실`
- 접근 모드: `public`
- 공개 URL: <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>
- 최신 배포: **version 8**, 성공
- version 8에는 3차시와 당시 인증 관련 변경이 포함됨
- 설정: `web/.openai/hosting.json`

운영 환경 변수는 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`다. `service_role` 키를 사용하지 않는다.

배포 원칙:

- Sites 지침을 그 세션에서 다시 읽는다.
- `get_site`로 기존 프로젝트와 공개 범위를 확인한다.
- 기존 프로젝트 ID를 재사용하고 공개 범위를 바꾸지 않는다.
- 소스 push → 전체 SHA 확인 → 빌드 → 패키징 → 버전 저장 → 공개 배포 순서를 따른다.
- Windows에서 공식 `package-site.mjs`가 `bash` 부재로 실패할 수 있다. 3차시는 내부 `prepare-site-build.cjs`로 staging 후 `tar`로 동일 구조를 만들었다.
- 아카이브에는 `dist/server/index.js`와 `dist/.openai/hosting.json`이 있어야 한다.
- 임시 인증 토큰, 아카이브, staging 디렉터리를 남기지 않는다.

## 6. Supabase와 인증

- 프로젝트 ref: `ujhcwxscxepbttqcysal`
- URL: `https://ujhcwxscxepbttqcysal.supabase.co`
- 학생 직접 회원가입 UI 없음
- 학생 계정은 교사가 Authentication에서 생성
- Auth 생성 후 같은 `user_id`로 `student_profiles`를 별도 입력
- `/login`은 이메일·비밀번호 로그인만 제공

`lesson_progress`:

- 복합 PK: `(user_id, lesson_no)`
- `lesson_no`: 1~10
- `current_step`, `quiz_score`, `reflection`, `completed`
- `activity_data jsonb`
- 학생은 자신의 행만 SELECT/INSERT/UPDATE
- 4차시는 새 테이블 없이 `lesson_no = 4`와 `activity_data`를 사용한다.

적용된 마이그레이션:

```text
web/supabase/migrations/20260917_lesson_activity_data.sql
web/supabase/migrations/20260917_allow_admin_created_students.sql
web/supabase/migrations/20260917_staff_roles.sql
```

최고관리자 이메일은 `superadmin@hj-ai-class.com`이다. 비밀번호는 기록하지 않는다. 학생 프로필이 없는 최고관리자는 기본 학생 UI에서 이름이 `학생`으로 보일 수 있으며 관리자 UI 작업에서 별도로 다룬다.

## 7. 핵심 코드 구조

`web/lib/lesson-progress.ts`:

```ts
type LessonProgress = {
  lessonNo: number;
  currentStep: number;
  quizScore: number | null;
  reflection: string;
  completed: boolean;
  activityData?: Record<string, unknown>;
}
```

4차시는 `loadLessonProgress(4, true)`와 `saveLessonProgress({ lessonNo: 4, ... })`를 사용한다.

`web/app/lesson/3/page.tsx`의 저장 패턴:

- 800ms 디바운스 자동 저장
- Promise queue로 저장 순서 보장
- revision으로 늦은 저장의 최신 상태 덮어쓰기 방지
- `beforeunload` 미저장 경고
- 저장 실패 재시도
- 로드 실패 시 기존 기록 보호를 위해 활동 차단
- `activity_data` 전체 복원
- 완료 후 수정하면 `completed = false`
- 홈 이동 전 미저장 변경 저장

공통 훅 추출은 선택 사항이다. 4차시 완성보다 리팩터링 범위를 키우지 않는다.

홈 `web/app/page.tsx`:

- 현재 1~3차시 링크 활성화: `lesson.no <= 3`
- 4차시 구현 후 `lesson.no <= 4`, `aria-disabled={lesson.no > 4}`로 변경
- 4차시 제목은 이미 「AI에게 잘 지시하는 방법」으로 등록됨
- 전체 진도와 현재 차시 표시는 하드코딩 상태이며 이번 범위에서 전면 개편하지 않아도 됨

3차시 파일:

```text
web/app/lesson/3/page.tsx
web/app/lesson/3/content.tsx
web/lib/lesson-three.ts
```

3차시는 강점 분류, 한계 분류, 사실 확인·개인정보 안전, 3문항 퀴즈, 성찰로 구성된다. 완료 조건은 세 활동 모두 정답 확인, 퀴즈 모두 정답, 성찰 10자 이상이다.

주의: 3차시 공개 배포는 성공했지만 로그인 후 전체 활동의 저장·새로고침 복원·완료/완료 해제를 끝까지 수행한 E2E 기록은 없다. 4차시 테스트 전에 짧게 회귀 확인하면 좋다.

## 8. 4차시 구현 목표와 권장 설계

제목: **「AI에게 잘 지시하는 방법」**

6학년 학생이 모호한 요청과 구체적인 요청을 비교하고, 목표·상황·조건·결과 형식을 포함해 안전한 지시를 작성하며, 첫 결과를 확인한 뒤 수정 요청을 할 수 있게 한다.

콘텐츠 원칙:

- ‘정답 프롬프트’ 하나를 외우게 하지 않는다.
- 길기만 한 지시가 좋은 지시는 아니라는 점을 설명한다.
- 목표, 필요한 배경, 조건, 원하는 결과 형식을 학생 언어로 가르친다.
- 첫 답이 부족하면 구체적인 피드백으로 다시 요청하는 과정을 포함한다.
- 이름, 전화번호, 주소, 비밀번호를 예시 입력값으로 쓰지 않는다.
- 실제 외부 AI 호출 없이 준비된 결과를 비교하는 시뮬레이션으로 구현한다.
- AI 결과는 사람이 확인한다는 3차시 원칙과 연결한다.
- 모바일·키보드 접근성을 2·3차시 수준으로 유지한다.

권장 5단계:

1. **생각 열기** — 두 요청 중 더 이해하기 쉬운 요청 고르기
2. **좋은 지시의 네 가지 단서** — 목표·상황·조건·결과 형식 분류
3. **요청을 구체적으로 바꾸기** — 모호한 요청에 필요한 조건을 선택해 결과 비교
4. **결과를 보고 다시 요청하기** — 부족한 결과를 확인하고 알맞은 수정 요청 선택
5. **배움 확인** — 3문항 퀴즈와 나만의 안전한 지시 작성/성찰

최소 파일:

```text
web/app/lesson/4/page.tsx
web/app/lesson/4/content.tsx
web/lib/lesson-four.ts
```

권장 활동 데이터:

```ts
type LessonFourActivities = {
  opening: number | null;
  clueChoices: Array<number | null>;
  cluesChecked: boolean;
  detailChoices: boolean[];
  detailResultChecked: boolean;
  revisionChoices: Array<number | null>;
  revisionsChecked: boolean;
  answers: Array<number | null>;
  quizChecked: boolean;
  ownPrompt: string;
};
```

`ownPrompt`는 `activity_data`에 저장하고 `reflection`에는 “AI의 첫 결과가 부족할 때 내가 할 일”을 저장한다.

권장 완료 조건:

- 네 가지 단서 분류 모두 정답 확인
- 구체화 활동에서 핵심 조건을 포함하고 결과 확인
- 수정 요청 사례 모두 정답 확인
- 퀴즈 3문항 모두 정답
- 나만의 지시 20자 이상
- 성찰 10자 이상

`restoreActivities()`는 저장 JSON의 배열 길이, 숫자 범위, boolean, 문자열 길이를 검증한다.

## 9. 4차시 검증 체크리스트

- [ ] 미로그인 `/lesson/4` 접근 시 `/login` 이동
- [ ] 로그인 후 5단계 이동 가능
- [ ] 키보드로 라디오·체크박스·버튼 조작 가능
- [ ] 변경 후 약 800ms 뒤 저장 상태 표시
- [ ] 새로고침 후 단계와 모든 `activity_data` 복원
- [ ] 오답·미완료 상태에서는 완료 불가
- [ ] 완료 시 `lesson_no = 4`, 점수, 성찰, `completed = true` 저장
- [ ] 완료 후 답이나 글 수정 시 `completed = false`
- [ ] 저장 실패 시 오류와 재시도 표시
- [ ] 모바일에서 가로 넘침·버튼 잘림 없음
- [ ] 홈에서 4차시 진입 가능
- [ ] build 성공 및 `/lesson/4` 라우트 확인
- [ ] 기존 공개 Sites 프로젝트 배포 성공
- [ ] 공개 URL에서 로그인 후 저장·복원 확인

## 10. 범위 밖의 알려진 문제

1. 홈의 전체 진도와 현재 차시 표시는 DB와 연결되지 않았다.
2. `/teacher`는 인증·역할 검사가 없는 목업이다.
3. 최고관리자 전용 UI가 없다.
4. 학생 Auth 계정과 `student_profiles`를 각각 만들어야 한다.
5. 비밀번호 재설정 UI가 없다.
6. 1차시 활동 복원은 2·3차시보다 완전하지 않다.
7. 네트워크 장애 시 로컬 오프라인 저장은 없다.
8. 로그인 보호는 클라이언트 리다이렉트이며 민감 데이터 보호는 RLS에 의존한다.
9. README의 인증 설명이 현재 운영 방식과 다를 수 있다.
10. 전체 lint에 기존 오류가 남아 있다.

## 11. 다음 세션 완료 기준

- `/lesson/4` 수업 내용과 상호작용 구현
- 학생별 자동 저장과 새로고침 복원
- 퀴즈·직접 작성·성찰·완료 조건 저장
- 완료 후 수정 시 완료 상태 해제
- 홈에서 4차시 진입 가능
- build 성공 및 `/lesson/4` 확인
- 실제 계정 E2E 검증
- 기존 공개 Sites 프로젝트에 새 버전 배포
- 공개 URL에서 4차시 저장·복원 확인
- 인수인계 문서와 Git 상태 갱신
