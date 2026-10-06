# AI 코딩 교실 — 현재 작업 인수인계

최종 갱신: 2026-10-06(KST)

**1~10차시 콘텐츠 개선 구현·검증·기존 사이트 게시 완료. 미착수 차시는 없다.**
최종 운영 기준은 **version53 / e0aeb2c9696f2c8ad0aad1e9f2a868989424d72f**이다. 차시별 근거는 [구현 결과](LESSON_CONTENT_IMPROVEMENT_RESULTS.md)에 있다. 다음 재개는 실제 수업 관찰 결과나 사용자가 지정한 추가 수정에서 시작한다.

## 운영 상태

- 기존 Site: AI 코딩 교실 / appgprj_6a962dcd21f08191876edad89331f7c3 / public.
- 공개 URL: https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site
- version53 배포 성공: appgdep_6ac453aff79881919eec6b5665db872d, 환경 revision2 유지.
- Supabase ujhcwxscxepbttqcysal, 기존 React/Vinext/Vite/TypeScript 구조·의존성·DB/RLS·계정·교사 권한 유지.
- 완료된 담임교사 반별 접근 제한/version39를 재적용하지 않는다. 필요할 때만 TEACHER_CLASS_ACCESS_RESULTS_2026-10-05.md를 참고한다.
- 학생 전원 Canva 계정과 AI 코드가 준비되어 있다. 5~10차시는 웹 계획/기록→Canva 실제 제작·시험·수정→웹 복귀 수업이다. 실행 공유 URL과 다시 수정하는 원본 프로젝트/AI 코드 대화를 구별한다.

## 최근 수정

- 학생 홈의 고정1차시/10%/진행 중 표시를 본인 DB 완료 기록·다음 미완료 차시로 교체했다.1·3~10차시의 단계 이동에서 완료를 해제하던 오류도 수정했다. 배경 조회 중 화면 유지, 최종 build·회귀38개·로컬/공개 진도/완료 유지 검증 완료. 상세는 STUDENT_HOME_PROGRESS_FIX_RESULTS.md.
- 과거 미완료로 저장된 이유는 구별할 수 없어 기존 기록을 임의로 완료 처리하지 않았다. 필수 활동 확인 후 해당 차시 완료 버튼으로 다시 저장하면 반영된다.

- 한 문장 게시판 보기 링크를 모든 차시의 공통 컴포넌트에서 직접 이동 링크로 수정했다. 출발 차시 필터의 hydration 복원도 수정했다. 공개 클릭/새로고침, 로컬 모바일/Enter, 변경파일 lint·전체 build를 확인했다. 상세는 REFLECTION_BOARD_LINK_FIX_RESULTS.md.
- 전체 lint는 기존 staging 빌드 산출물 때문에 실패한다. 게시판 전송·차시 저장·인증·DB/RLS는 변경하지 않았다.

## 구현과 검증

- 3·4차시의 안전 행동·근거 비교·요청 조건별 예시를 보존하고 5→6→7→8→9→10→1→2 순서로 한 차시씩 구현·검증·게시했다.
- 5~10차시: 원본과 계획 재사용, 자기 앱 시험·작은 수정·재시험, 수행/성공/미수행 구별, 40분 운영 안내와 기존 글칸 지원을 구현했다. 공통 안전 검사는 일부 개인정보 형태를 확인하며 앱 성공이나 모든 의미를 인증하지 않는다.
- 1차시: 기호·줄별 뜻·계산 지원과 제한된 모형 설명, 역사 사례 근거를 보완했다. 2차시: 반복 용어·예상/실제 비교와 성공 이력/현재 결과 구별, 모바일 비교표를 보완했다.
- 기존 lesson_no, activity_data 키/타입·배열의 순서와 의미·정답·5단계·배점·필수 수·최소 길이·기본값/복원을 보존했다. 1차시 이동4/수학3도 필수로 유지한다.
- 인증 보호, 약800ms 자동 저장·저장 큐·오래된 응답 방지·실패 재시도·로드 실패 보호·이탈 경고, 오답/미완료 차단·답 수정 후 완료 해제를 유지했다.
- 각 변경 차시의 전용 계정 1~5단계·저장/새로고침 복원·오답/미완료 차단·완료/수정 해제/재완료·375px·키보드와 공개 핵심 동작을 확인했다. 변경 content/lib/tests 및 해당 1·8~10 page lint 통과, 최종 전체 build와 회귀31개 통과. 독립 읽기 전용 diff 감사에서 새 실질 결함 없음.
- 콘텐츠 개선 당시 전용 계정 요약은 1~10 모두 완료, 키 수 13/10/9/10/14/14/14/13/16/15이다. 이번 나머지 작업 전후 3·4차시의 요약/갱신 시각이 동일하다. 실제 학생 상세·전체 학급 CSV는 조회하지 않았다.
- 로컬/공개 테스트 모두 로그아웃했고 임시 viewport를 복원했다. 공개 2차시 캡처와 차시별 모바일/공개 증거는 web/outputs/content-improvement에 있다.
- 학생 시간·흥미·학습 효과·Canva 개별 앱 성공·실제 짝 의견은 미실측/미관찰이다. 웹 체크는 자기보고이며 과거 체크를 새 수행 증거로 해석하지 않는다. 개발 테스트 글은 외부 수행을 하지 않았음을 표시한다. 네트워크 실패 주입, 게시판 전송·보관함 등록·교사 대시보드 전체 E2E는 이번 콘텐츠 검증 범위 밖이다.

## 알려진 문제와 환경

- 2~7 page에는 기존 React compiler/ref/effect/deps/status/내부 링크 관련 lint 오류가 남는다(각7개). 변경 content/lib/tests는 통과했으며 이를 전체 저장소 lint 통과로 표현하지 않는다.
- 홈 정적 진도와 단계 이동 완료 해제는 version53에서 수정했다. 초기/모두 완료는 로직 테스트, 통신 실패 주입은 미실시다.
- Windows 스킬 build helper의 npm.cmd 경로 오류는 PowerShell npm run build 성공 결과를 게시 workflow에 재사용해 해결했다. 게시 명령에만 Git bin PATH 및 TAR_OPTIONS=--force-local 적용. 프레임워크나 lockfile 변경 없음.
- source credential은 세션 메모리/숨겨진 stdin만 사용한다. TEST_ACCOUNT.md·.env.local·토큰 값을 문서/로그/Git에 남기지 않는다.
- 루트와 web은 별도 Git이다. 루트의 기존 미커밋 문서·web/supabase/tests/와 web의 기존 미추적 tests/staff-access-live.mjs를 보존한다. reset/clean/임의 checkout하지 않는다. 상위 GitHub 커밋·push는 하지 않았다.
- 게시용 임시 로컬 exclude는 원본 바이트로 복원했다. 이번 나머지 작업의 배포 archive만 정리했고 이전 .site-stage-*·archive·web/.git·scripts는 보존했다. 이번 개발 서버를 종료했다.

## 다음 재개

새 작업을 시작할 때 web/AGENTS.md→이 문서→LESSON_EDITING_GUIDE.md→LESSON_CONTENT_IMPROVEMENT_RESULTS.md를 읽고 최신 Site/양쪽 Git 상태를 확인한다. 개선 계획·검토 보고서는 당시 근거로 보존되어 있다. 완료한 차시를 처음부터 재구현하거나 교사 권한/DB를 반복 적용하지 않는다.

실제 수업 관찰에서는 Canva 생성/수정 대기, 짝 시험, 40분 완료/미완료, 학생의 예상·실제 근거와 성찰을 수집해 추가 수정 범위를 정한다. 관찰 자료가 없을 때 개발 검증을 수업 효과 검증으로 대체하지 않는다.
