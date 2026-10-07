# AI 코딩 교실 — 현재 상태와 재개 안내

갱신·상태 확인: 2026-10-07(KST). **1차시 STEP3 롤러코스터 영상 링크 추가까지 구현·version58 배포 완료.** 새 사용자 지시를 받은 뒤 필요한 범위만 읽고 시작한다.

## 운영 기준

| 항목 | 현재 기준 |
|---|---|
| 공개 사이트 | https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site |
| Site 프로젝트 | `appgprj_6a962dcd21f08191876edad89331f7c3` / public / active |
| 최신 운영 | version58 / `d4dad4d523e772795c8cd9e7a0e47cc30476ff0c` |
| 성공 배포 | `appgdep_6ac5d2d7dd34819197f3b1159ad5b186` / 환경 revision2 |
| Supabase | `ujhcwxscxepbttqcysal` / 기존 DB·RLS·계정·권한 유지 |
| 실제 소스 | `web/` / React·Vinext·Vite·TypeScript / 기존 lockfile 유지 |

이번 작업은 1차시 STEP3 ‘게임 속 실제 이야기’의 FAQ 옆에 ‘롤러코스터 게임 실제 모습 보기’ 링크를 추가했다. 주소는 `https://youtu.be/BJFKPMUQKJ4?si=hnBedlYkoaZV9n20`, 새 탭으로 열리며 모바일에서 줄바꿈한다. DB·활동·완료 조건 변경은 없다. 앞선 차시별 배지, 학생 상세 삭제 본문 재표시 수정, 앱 보관함 관리와 학생 등록·조회 전용 제한을 유지한다. 기존 SQL은 다시 실행하지 않는다. Sites 도구가 version58 배포 성공·동일 공개 URL을 확인했다.

## 완료된 작업과 근거

| 작업 | 완료 기준 | 상세 자료 |
|---|---|---|
| 1차시 STEP3 롤러코스터 영상 링크 | version58, DB 변경 없음 | `web/app/lesson/1/page.tsx` / `web/outputs/lesson-one-video-link/` |
| 1~10차시 배지·기존 완료 기록 반영 | version57, DB 변경 없음 | [배지 수정 결과](STUDENT_BADGE_FIX_2026-10-07.md) |
| 학생 상세 삭제 게시글 재표시 수정 | version56, 운영 DB 적용 완료 | [학생 상세 수정 결과](ADMIN_STUDENT_DETAIL_FIX_2026-10-07.md) |
| 관리자 앱 보관함·학생 등록 전용 | version55, 운영 DB 적용 완료 | [앱 보관함 관리 결과](ADMIN_APP_MANAGEMENT_2026-10-07.md) |
| 게시판 관리 편의성·완전 삭제 | version54, 운영 DB 적용 완료 | [게시판 관리 개선 결과](ADMIN_BOARD_MANAGEMENT_2026-10-07.md) |
| 관리자 개선·게시판 중재 | version38, 이후 버전에 보존 | [관리자 개선 결과](ADMIN_IMPROVEMENTS_2026-10-05.md) |
| 담임교사 담당 반 접근 제한 | version39, 운영 DB 적용 완료 | [교사 권한 결과](TEACHER_CLASS_ACCESS_RESULTS_2026-10-05.md) |
| 1~10차시 콘텐츠 개선 | version40~50, 미착수/부분 구현 차시 없음 | [차시별 구현 결과](LESSON_CONTENT_IMPROVEMENT_RESULTS.md) |
| 한 문장 게시판 이동·출발 차시 필터 복원 | version51 | [게시판 링크 수정 결과](REFLECTION_BOARD_LINK_FIX_RESULTS.md) |
| 학생 홈 실제 진도·완료 표시, 단계 이동 완료 유지 | version52~53 | [학생 진도 수정 결과](STUDENT_HOME_PROGRESS_FIX_RESULTS.md) |

학생 전원 Canva 계정과 AI 코드가 준비되어 있다. 5~10차시는 웹 계획/기록 → Canva 실제 제작·시험·수정 → 웹 복귀로 운영한다. 공유 실행 URL과 수정 가능한 원본 프로젝트/AI 코드 대화를 구별한다.

## 보존해야 할 동작

- 기존 Site/public, DB/RLS, 학생 본인 저장·복원, 교사 담당 반·최고관리자 권한을 유지한다. 완료된 SQL·계정 배정을 다시 적용하지 않는다.
- `lesson_no`, `activity_data` 키·타입·배열 순서/의미, 정답·5단계·배점·필수 수·최소 길이·기본값/복원 호환성을 유지한다. 1차시 이동4/수학3도 필수다.
- 로그인 보호, 약800ms 자동 저장, 저장 큐·오래된 응답 방지·실패 재시도·로드 실패 보호·이탈 경고를 유지한다.
- **단계만 이동하면 완료 유지, 실제 활동·답안·성찰을 수정하면 완료 해제.** 오답/미완료 차단을 유지한다.
- 홈 완료율은 실제 `completed=true` 수/10, 이어하기는 가장 앞의 미완료 차시다. 배경 갱신 중 기존 홈을 유지하며 조회 실패를 임의의1차시/10%로 대체하지 않는다.
- 차시별 배지도 동일한 `completed=true` 기준이며 과거 완료를 바로 반영한다. 배지를 주간 초기화하거나 1차시 완료를 다른 배지의 선행 조건으로 삼지 않는다.
- 학생 기록 삭제/초기화/일괄 완료 처리를 하지 않는다. 과거 미완료 저장의 원인을 구별할 이력이 없어 자동 복구하지 않았다. 해당 차시는 필수 활동 확인 후 완료 버튼으로 다시 저장한다.

## 검증 결과와 한계

- 이번 링크 추가: 1차시 page lint·최종 전체 build·diff check 통과. 로컬 UI에서 정확한 href/새 탭 설정, FAQ 옆 배치, Tab 초점·14px/44px 조작 영역, 375px 줄바꿈·가로 넘침 없음, reload 확인. 테스트 계정 시작 단계4→검증3→4로 복원해 저장됨 확인, 활동·답안은 조작하지 않았으며 홈 완료8개는 시작/종료 동일하다. 로그아웃·viewport/exclude 복원·서버 종료·이번 archive 삭제 완료. 유튜브 영상 재생 자체는 검증하지 않았다. 증거는 `web/outputs/lesson-one-video-link/desktop.jpg`, `mobile.jpg`다.

- 이번 배지 수정: 배지18개+진도7개 총25개, 관련 lint·전체 TypeScript·최종 build·실제 인증 읽기 API 통과. 전용 계정 완료9개가 홈/배지/reload에서 일치하고 6차시 대기, Enter·375px 확인. 기존 기록 쓰기 없음. 로그아웃·viewport/exclude 원복·서버 종료·이번 archive 삭제 완료. 통신 실패 주입·계정 전환 실험은 미실시이며 코드로 보호를 검토했다. 상세는 배지 수정 결과를 따른다.

- 이번 상세 수정: 관련 lint·전체 TypeScript·최종 build·합성 DB rollback26개·실제 인증 읽기 API 통과. 실제 테스트 학생 삭제 상태10개가 상세/재열기/게시판 경유/페이지 reload에서도 본문 없이 표시됨. Enter·375px 확인. 기존 기록 쓰기 없음. 로그아웃·viewport/exclude 원복·서버 종료. 이번 archive 삭제가 정책 차단되어 남았다. 상세 검증 범위는 학생 상세 결과를 따른다.

- 이번 보관함 변경: 관련 lint·전체 TypeScript·최종 build·운영 DB 합성 롤백47개·실제 인증 API 통과. 관리자 검색/선택/수정·삭제 확인 취소/Enter·375px, 학생 수정/삭제/휴지통 조작0개 확인. 기존 앱은 실제 변경/삭제하지 않았다. 세션 로그아웃·viewport/exclude 복원·서버 종료 완료. 임시 파일 삭제가 정책 차단되어 이번 build cache/archive/exclude backup이 남았다. 상세는 앱 보관함 결과를 따른다.

- 이번 게시판 변경: 관련 lint·전체 TypeScript·최종 build·단위3개·실제 인증 API·운영 DB 합성 데이터 롤백42개 통과. UI 선택/초기화/삭제 확인/키보드와375px 확인, 기존 글의 UI 삭제는 취소했다. 테스트 세션 로그아웃·viewport 복원·임시 exclude 복원 완료. 세부 범위와 한계는 게시판 관리 개선 결과를 따른다. 아래는 이전 콘텐츠·진도 변경의 검증 기록이다.

- 최종 소스 전체 build 성공. 진도7개 + 기존 차시2~10/안전 검사31개 = **회귀38개 통과**. 변경 홈/lib/hook/test 및1·8~10 page lint 통과.
- 콘텐츠 개선에서는 차시별 전용 계정 단계·저장/새로고침 복원·오답/미완료 차단·완료/수정 해제/재완료·키보드·375px와 공개 핵심 동작을 확인했다.
- 게시판 링크는 로컬 클릭/Enter·차시 필터·모바일, 공개 이동/새로고침을 확인했다.
- 진도 수정은 실제 기록50%/다음2 → 2차시 완료60%/다음4 → 원래 상태50%로 복원, 완료1차시 단계 이동 후 완료 유지, 실제 성찰 수정 시 해제를 확인했다. 테스트 종료 요약은 시작 요약과 동일하며1/2차시 갱신 시각만 바뀌었다. 실제 학생 상세/전체 학급 CSV는 조회하지 않았다.
- 진도0%/100%는 로직 테스트다. 통신 실패 주입·다른 계정 전환 실험은 미실시, 응답/계정 보호는 코드로 확인했다. 이번 콘텐츠/진도 검증을 게시판 전송·보관함·교사 대시보드 전체 E2E 통과로 확대하지 않는다.
- 2~7 page의 기존 lint 오류는 각7개가 남는다. 기본 전체 lint는 기존 `.site-stage-*` 빌드 산출물까지 포함해 실패했다. 전체 lint 통과라고 표현하지 않는다.
- 실제 학생의 시간·흥미·학습 효과, Canva 작품 성공·짝 의견은 미실측이다. 웹 체크는 자기보고이며 과거 체크를 새 수행 증거로 해석하지 않는다.

상세 증거는 보고서와 `web/outputs/content-improvement/`, `web/outputs/board-link-fix/`, `web/outputs/home-progress-fix/`, `web/outputs/lesson-e2e/`에 있다. 출력 파일은 일부 Git 제외 대상이므로 보고서의 요약을 먼저 읽는다.

## 작업별 최소 파일 찾기

| 새 요청의 대상 | 먼저 읽을 파일 |
|---|---|
| 특정 차시 설명·활동 | [편집 가이드](LESSON_EDITING_GUIDE.md)의 해당 차시 page/content/lib와 해당 결과 항목 |
| 홈 진도·완료 표시 | `web/app/page.tsx`, `web/lib/student-course-progress.ts`, `web/lib/use-student-course-progress.ts`, `web/lib/lesson-progress.ts` |
| 차시별 배지 | `web/app/badges/page.tsx`, `web/lib/student-badge.ts`, `web/lib/use-student-badge.ts`, 공통 진도 훅 |
| 게시판 이동·필터 | `web/components/reflection-board-actions.tsx`, `web/app/reflection-board/page.tsx` |
| 저장·복원 | `web/lib/lesson-progress.ts`, 해당 차시 page/lib |
| 교사/관리자 권한·중재 | 교사 권한 보고서 → `web/lib/staff-access.ts`, 관련 admin lib/page·SQL을 요청 범위만 확인 |

기획·검토·E2E 문서는 당시 근거다. 과거의 version24, 미착수, 전체 완료 테스트 계정 상태를 현재 운영/학생 상태로 해석하지 않는다.

## 새 세션 시작 순서

1. 이 문서와 `web/AGENTS.md`를 읽고 **새 사용자 요청**의 대상·완료 기준을 정한다. 요청이 없으면 구현/배포를 시작하지 않는다.
2. 양쪽 Git 상태와 Site 상태를 확인하고 현재와 다르면 기준을 갱신한다. 루트와 `web`은 별도 Git이다.
3. 위 파일 찾기에 따라 요청에 필요한 자료만 읽는다. 실제 사이트 편집·배포에서는 현재 설치된 Sites 스킬과 `web/AGENTS.md` 절차를 따른다.
4. 변경 영향에 맞춰 검증하고 같은 Site에 반영한다. 결과와 이 문서·재개 프롬프트를 갱신한다.

2026-10-06 확인 시 루트 HEAD는 `c07ad0a5c063d736a8a3c9294dfaaa4806e9ff9e`이고 시작 상태는 `?? web/supabase/tests/`뿐이었다. `web` 시작 상태는 `?? tests/staff-access-live.mjs`뿐이었다. 둘은 기존 파일이며 보존한다. 이번 정리는 루트 문서만 수정하며 자동 커밋/push하지 않는다. 이후 상태는 `git status --short`로 다시 확인한다.

비밀값은 `.env.local`/전용 계정 자료에 있으나 문서·로그·Git에 출력하지 않는다. 실제 학생 상세·CSV를 재개 점검용으로 열지 않는다. 검증은 전용 계정으로 하고 로그아웃한다. 이전 테스트는 로그아웃·viewport 복원·개발 서버 종료·임시 exclude 원본 복원·해당 세션 archive 정리까지 완료했다. 기존 staging/archive·`web/.git`·scripts를 일괄 삭제하거나 reset/clean하지 않는다.

Windows 게시 시 npm.cmd build helper 경로 문제는 성공한 PowerShell `npm run build` 결과 재사용으로 처리한 이력이 있다. Git bin PATH와 `TAR_OPTIONS=--force-local`은 게시 명령 환경에만 적용했다. 다음에는 설치된 스킬/도구에 맞춰 확인하며 프레임워크를 바꾸지 않는다.
