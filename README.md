# AI 코딩 교실

초등학교 6학년 학생을 위한 10차시 AI 코딩 수업 웹사이트입니다. 학생은 코딩의 발전과 AI의 특징을 배우고, 프롬프트와 앱을 설계한 뒤 Canva AI 코드에서 제작·시험·수정하고 웹에 과정과 성찰을 기록합니다.

**2026-10-07 기준: 게시판·앱 보관함·학생 상세·배지 개선에 이어 1차시 STEP3 롤러코스터 유튜브 영상 링크를 기존 사이트 version58에 배포 완료. 학생 앱 등록·조회 전용 제한을 유지합니다. 다음 작업은 아직 정하지 않았습니다.**

- [운영 사이트](https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site)
- [현재 상태·보존 조건·검증 한계·작업별 파일 찾기](SESSION_HANDOFF.md)
- [새 세션에 붙여 넣을 재개 프롬프트](NEXT_SESSION_PROMPT.md)
- [차시 편집 가이드](LESSON_EDITING_GUIDE.md)

## 현재 구현

- 교사가 미리 만든 이메일·비밀번호 계정으로 학생 로그인, 본인 프로필과 학습 기록 접근.
- 1~10차시의 설명·활동·퀴즈·성찰, 자동 저장·복원·완료 조건 검증.
- 실제 저장 기록에 따른 홈 완료율·완료 표시·다음 미완료 차시 이어하기.
- 익명 한 문장 게시판, 나의 앱, 저장 완료 기록에 따른 1~10차시 배지 화면과 획득 개수.
- 최고관리자 대시보드와 게시판 검색·일괄 숨김/복원/완전 삭제, 담임교사 담당 반 접근 제한.
- React·Vinext·Vite·TypeScript와 Supabase Auth/Postgres/RLS, 기존 OpenAI Sites 공개 호스팅.

학생 전원 Canva 계정과 AI 코드가 준비되어 있습니다. 5~10차시는 웹과 Canva를 오가며 진행합니다. 앱을 실행하는 공유 URL과 수정 가능한 원본 프로젝트/AI 코드 대화를 구별합니다. 웹 체크는 자기보고이며 실제 앱 성공·학생 시간·수업 효과 검증은 별도입니다.

## 10차시

| 차시 | 주제 |
|---:|---|
| 1 | 코딩은 어떻게 발전해 왔을까? |
| 2 | 전통 코딩과 AI 코딩 |
| 3 | AI는 무엇을 잘하고 못할까? |
| 4 | AI에게 잘 지시하는 방법 |
| 5 | Canva AI 코드 시작하기 |
| 6 | 한 기능 앱 만들기 |
| 7 | 앱 기능 설계하기 |
| 8 | 두 가지 이상의 기능을 가진 앱 만들기 |
| 9 | 나에게 필요한 앱 만들기 |
| 10 | 앱 공유와 개선 |

차시별 구현·완료 조건·검증 근거는 [콘텐츠 개선 결과](LESSON_CONTENT_IMPROVEMENT_RESULTS.md)에 있습니다. 제목과 화면의 최신 세부 문구는 해당 차시 소스를 기준으로 합니다.

## 저장소와 작업 시작

| 위치 | 역할 |
|---|---|
| 루트 문서 | 현재 인수인계, 수업 기획·편집 가이드, 작업별 결과 보고서 |
| `web/app/` | 학생·교사·관리자 라우트와 차시 화면 |
| `web/components/`, `web/lib/` | 공통 UI, 인증·저장·검증·진도 계산 |
| `web/tests/` | 단위/회귀 테스트, 별도 운영 검증 스크립트 |
| `web/supabase/` | 스키마·기존 적용 migration·권한 테스트 |
| `scripts/` | 기존 계정/배정 지원 및 전용 계정 검증 도구 |
| `web/outputs/` | 로컬 검증 증거·캡처; 일부 Git 제외 대상 |

루트 Git과 `web`의 배포용 Git은 별개입니다. 새 세션에서는 먼저 양쪽 상태를 확인하고 사용자 변경을 보존합니다. 사이트 편집·게시 절차는 [web/AGENTS.md](web/AGENTS.md)와 해당 세션의 Sites 스킬을 따릅니다. 같은 Site 프로젝트를 재사용하며, 이미 적용된 schema/migration/계정 배정을 재개 시 다시 실행하지 않습니다.

로컬 명령은 `web/`에서 실행합니다.

```powershell
npm run dev
npm run build
npx oxlint <변경한 소스 파일>
```

Node 버전과 TypeScript 테스트 로더 지원을 확인한 뒤 필요한 순수 로직 테스트만 실행합니다. 최신 진도 수정 당시의 38개 회귀 범위는 아래와 같습니다. `*-live.mjs`는 운영 데이터와 연결할 수 있으므로 일반 단위 테스트에 함께 넣지 않습니다.

```powershell
node --experimental-strip-types --import ./tests/register-ts-imports.mjs --test ./tests/student-course-progress.test.mjs ./tests/prompt-safety.test.mjs ./tests/lesson-two.test.mjs ./tests/lesson-three.test.mjs ./tests/lesson-four.test.mjs ./tests/lesson-five.test.mjs ./tests/lesson-six.test.mjs ./tests/lesson-seven.test.mjs ./tests/lesson-eight.test.mjs ./tests/lesson-nine.test.mjs ./tests/lesson-ten.test.mjs
```

전체 lint에는 기존 오류와 staging 산출물 검사 문제가 남아 있습니다. 관련 파일 lint·전체 build·변경 영향에 맞는 검증 결과를 구분해서 기록합니다. 위 회귀38개는 진도 수정 당시 결과이며, 최신 게시판 변경은 관련 lint·TypeScript·build·단위3개·DB 롤백42개와 실제 인증 API·UI 검증을 통과했습니다.

## 데이터와 보존

Supabase 프로젝트는 `ujhcwxscxepbttqcysal`입니다. 실제 환경값은 `web/.env.local`에 두며 이름은 `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`입니다. 키·비밀번호·토큰을 문서·로그·Git에 쓰지 않고 service_role 키를 브라우저에 넣지 않습니다.

`student_profiles`와 차시별 `lesson_progress`/`activity_data`를 기존 권한으로 사용합니다. 학생 본인 데이터, 교사 담당 반과 최고관리자 권한을 보존합니다. 실제 활동 수정은 완료를 해제하지만 단계 이동만으로는 해제하지 않습니다. 과거 오류로 미완료 저장된 기록은 실제 수정 여부를 구별할 수 없어 일괄 복구하지 않았으며, 활동 확인 후 완료 버튼으로 다시 저장해야 합니다.

검증은 전용 계정으로 하고 로그아웃합니다. 재개 점검용으로 실제 학생 상세나 전체 학급 CSV를 열지 않습니다. 기존 저장 키·타입·정답·필수 조건·자동 저장·복원을 바꿀 때에는 영향을 확인합니다.

## 결과 자료와 과거 기획

- [1~10차시 배지 수정](STUDENT_BADGE_FIX_2026-10-07.md)
- [게시판 관리·완전 삭제 개선](ADMIN_BOARD_MANAGEMENT_2026-10-07.md)
- [관리자 앱 보관함 개선](ADMIN_APP_MANAGEMENT_2026-10-07.md)
- [학생 상세 삭제 기록 재표시 수정](ADMIN_STUDENT_DETAIL_FIX_2026-10-07.md)

- [1~10차시 콘텐츠 개선](LESSON_CONTENT_IMPROVEMENT_RESULTS.md)
- [게시판 링크 수정](REFLECTION_BOARD_LINK_FIX_RESULTS.md)
- [학생 진도 수정](STUDENT_HOME_PROGRESS_FIX_RESULTS.md)
- [관리자 개선](ADMIN_IMPROVEMENTS_2026-10-05.md)
- [교사 담당 반 접근 제한](TEACHER_CLASS_ACCESS_RESULTS_2026-10-05.md)
- [제품 요구사항](PRD.md), [개선 계획](LESSON_CONTENT_IMPROVEMENT_PLAN.md), [콘텐츠 검토](LESSON_CONTENT_REVIEW_RESULTS.md): 당시 설계·검토 근거이며 현재 구현/미완료 목록이 아닙니다.

실제 학급 수업 관찰과 사용자가 지정할 새 개선 요청은 아직 다음 작업으로 확정하지 않았습니다.
