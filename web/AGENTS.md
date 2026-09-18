# OpenAI Sites 전용 작업 지침

이 파일은 `web` 디렉터리와 그 하위 파일을 수정하는 모든 Codex 작업에 적용한다. 이 프로젝트는 새 사이트가 아니라 이미 운영 중인 OpenAI Sites 프로젝트다.

## 1. 사이트 식별 정보

- 사이트 이름: `AI 코딩 교실`
- Sites 프로젝트 ID: `appgprj_6a962dcd21f08191876edad89331f7c3`
- 슬러그: `hj-ai-coding-class-2026`
- 공개 주소: <https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site>
- 현재 접근 범위: `public`
- 로컬 manifest: `.openai/hosting.json`
- 외부 데이터 서비스: Supabase project ref `ujhcwxscxepbttqcysal`

`.openai/hosting.json`의 기존 `project_id`를 반드시 재사용한다. 이 프로젝트를 대신할 새 Site를 만들거나 새 프로젝트 ID로 덮어쓰지 않는다. 사용자가 명시적으로 변경하지 않는 한 공개 범위도 유지한다.

## 2. 세션 시작 절차

사이트를 구현·수정·배포하는 세션에서는 다음 순서를 지킨다.

1. 저장소 루트의 `SESSION_HANDOFF.md`를 읽는다.
2. 현재 설치된 `sites:sites-building`과 `sites:sites-hosting`의 `SKILL.md`를 읽는다. 설치 버전의 지침이 이 파일과 다르면 최신 스킬과 사용자 요청을 우선한다.
3. `git status --short`와 현재 변경 파일을 확인한다. 기존 미커밋 작업을 reset, checkout, clean으로 제거하지 않는다.
4. 기존 Site이므로 Sites 도구의 `get_site`를 호출할 수 있는 환경에서는 편집 전에 현재 프로젝트를 조회해 같은 Site를 사용한다.
5. 설치된 Sites 플러그인의 `configure-execution-profile.mjs`를 이 `web` 디렉터리에서 실행한다. 스크립트는 절대 경로로 한 번에 하나씩 실행한다.
6. 이 사이트는 다중 라우트, 로그인, Supabase 영속 데이터를 사용하므로 Sites의 capability path로 작업한다.

## 3. 구현 원칙

- 기존 React/Vinext/Vite/TypeScript/Tailwind 구조와 `package-lock.json`을 유지한다.
- 요청에 필요하지 않은 의존성 추가, 프레임워크 교체, 전면 리디자인을 하지 않는다.
- 기존 학생용 디자인 토큰과 컴포넌트를 재사용한다.
- 본문은 16px 이상, 주요 조작 라벨은 14px 이상을 기본으로 한다.
- 모바일과 데스크톱에서 잘림이나 불필요한 가로 스크롤이 없어야 한다.
- 버튼·라디오·입력·단계 이동은 키보드로 사용할 수 있어야 하며 상태 문구에는 적절한 `role="status"` 또는 `role="alert"`를 사용한다.
- 실제 학생 개인정보를 예시나 테스트 데이터로 코드에 넣지 않는다.
- 기능보다 홍보 문구나 큰 장식 영역이 앞서지 않게 한다. 수업 페이지에서는 학생이 첫 화면에서 현재 단계와 해야 할 활동을 바로 이해할 수 있어야 한다.
- 이미지가 꼭 필요하지 않은 학습 UI에는 장식 이미지를 추가하지 않는다. 기능 아이콘은 기존 Lucide 아이콘을 사용한다.

## 4. 인증과 데이터

- Supabase는 HTTP 클라이언트로 연결한다. Sites D1과 R2는 사용하지 않는다.
- 환경변수는 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`를 사용한다.
- 실제 값은 `.env.local`에만 둔다. 키, 비밀번호, source credential, access token을 코드·문서·로그·Git 원격 URL에 넣지 않는다.
- `service_role` 키를 클라이언트나 Sites 환경에 등록하지 않는다.
- 학생 데이터 보호는 Supabase RLS를 유지한다.
- 차시별 활동은 기존 `lesson_progress` 행과 `activity_data jsonb`를 사용한다. 새 차시마다 별도 테이블을 만들지 않는다.
- 학생 계정은 교사가 생성한다. 로그인 화면에 학생 직접 가입을 다시 추가하지 않는다.
- 최고관리자 역할은 애플리케이션 DB/RLS 수준이다. 이를 Supabase Dashboard 관리자나 프로젝트 소유자 권한처럼 취급하지 않는다.

## 5. 차시 구현 패턴

새 차시는 2차시 구현을 기준으로 한다.

```text
app/lesson/2/page.tsx
app/lesson/2/content.tsx
lib/lesson-two.ts
lib/lesson-progress.ts
```

필수 동작:

- `useStudentSession()`을 통한 로그인 보호
- `loadLessonProgress(차시번호, true)`로 단계와 `activity_data` 복원
- `saveLessonProgress()`로 단계, 점수, 성찰, 완료 여부, 활동 데이터 저장
- 800ms 수준의 자동 저장
- 저장 요청 순서 보장과 오래된 응답 방지
- 저장 실패 재시도
- 로드 실패 시 기존 기록을 덮지 않도록 활동 진입 차단
- 미저장 상태에서 페이지 이탈 경고
- 완료 조건을 모두 충족한 경우에만 완료 처리
- 완료 후 답을 수정하면 완료 상태 해제

새 차시를 추가하면 학생 홈의 해당 링크와 상태도 함께 갱신한다.

## 6. 검증 절차

소스 변경 후 다음을 실행한다.

```powershell
npm run lint
npm run build
```

Sites 스킬이 제공하는 빌드 스크립트를 요구하면 해당 세션에 설치된 플러그인의 `build-site.mjs`를 절대 경로로 실행한다. 소스가 마지막 성공 빌드 이후 변경되었다면 재빌드한다.

차시 변경은 최소한 다음을 직접 검증한다.

- 미로그인 사용자가 `/login`으로 이동함
- 로그인 후 차시 단계 이동 가능
- 선택·답안·성찰이 저장됨
- 새로고침 후 현재 단계와 활동 전체가 복원됨
- 오답 또는 미완료 상태에서 완료할 수 없음
- 완료 데이터가 올바른 `lesson_no`로 저장됨
- 완료 후 내용을 수정하면 완료 상태가 해제됨
- 모바일과 키보드 조작이 가능함

공개 배포 후에도 실제 Sites URL에서 로그인, 저장, 복원을 한 번 확인한다. 테스트 후 관리자 또는 테스트 세션을 브라우저에 로그인된 채로 남기지 않는다.

## 7. 배포 원칙

사용자가 로컬 작업만 요청하거나 배포하지 말라고 명시하지 않는 한, Sites 수정은 구현과 검증 후 기존 사이트에 게시까지 완료한다.

배포할 때:

1. 현재 설치된 `sites-hosting`의 Publishing 및 Handoff 참조 문서를 읽는다.
2. `.openai/hosting.json`의 기존 프로젝트 ID와 현재 `public` 접근 범위를 확인한다.
3. Sites 소스 저장소는 이 `web` 디렉터리를 루트로 사용한다. 상위 GitHub 저장소 전체를 Sites 저장소로 밀지 않는다.
4. Sites가 요구하는 Git 저장소가 필요하면 `web`에 임시로 구성하되 상위 저장소의 `.git`을 변경하지 않는다.
5. source write credential은 명령별 HTTP 인증 헤더로만 사용한다. 파일, Git 설정, 원격 URL, 사용자 메시지에 저장하지 않는다.
6. 빌드 성공 후 정확한 전체 `HEAD` SHA를 확인하고, 동일한 소스로 패키징·버전 저장·배포한다.
7. 배포가 성공하기 전에는 완료라고 보고하지 않는다.
8. 배포 후 정확한 공개 URL을 확인한다.
9. 임시 `web/.git`, 배포 archive, 임시 credential 파일을 제거하고 상위 저장소의 `git status`를 다시 확인한다.

브라우저 미리보기나 추가 승인이 필요한지는 고정된 과거 절차를 따르지 말고, 현재 세션의 Sites 스킬과 도구 정책을 따른다.

## 8. Git과 문서화

- 상위 GitHub 저장소는 `C:\Users\rhkdd\OneDrive\문서\2학기 전학공`이다.
- 사용자 작업을 덮어쓰는 `git reset --hard`, 무차별 `git clean`, 임의 checkout을 실행하지 않는다.
- Sites 배포용 Git과 상위 GitHub 저장소를 구분한다.
- 변경 후 `SESSION_HANDOFF.md`에 구현 차시, 데이터 변경, 배포 버전, 알려진 문제를 갱신한다.
- 비밀번호와 키는 인수인계 문서에 기록하지 않는다.

## 9. 현재 우선순위

다음 세션의 최우선 작업은 5차시 **「Canva AI 코드 시작하기」** 구현이다. 구체적인 콘텐츠·완료 조건·검증 목록은 저장소 루트의 `SESSION_HANDOFF.md` 14절을 따른다. 교사 대시보드, 최고관리자 UI, 홈 전체 진도 실데이터화는 사용자가 별도로 요청하지 않으면 5차시 범위에 섞지 않는다.
