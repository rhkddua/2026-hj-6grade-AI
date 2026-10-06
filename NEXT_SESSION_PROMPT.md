# 다음 세션 재개 프롬프트 — 콘텐츠 개선 완료 후

현재 작업 폴더 C:\Users\rhkdd\OneDrive\문서\2학기 전학공의 AI 코딩 교실은 **1~10차시 콘텐츠 개선 구현·차시별 검증·기존 사이트 게시까지 완료**했습니다. 사용 한도로 중단되었던 나머지 작업도 끝났습니다. 미착수/부분 구현 차시는 없습니다.

최종 운영 기준은 **version51 / e1330d1ea5608badfe1ca92ec79b0c58cb0c3da0**입니다. 기존 Site appgprj_6a962dcd21f08191876edad89331f7c3, public URL https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site 를 유지했습니다.

다음 작업은 새 사용자 지시나 실제 수업 관찰 결과에서 시작하세요. 먼저 web/AGENTS.md, SESSION_HANDOFF.md, LESSON_EDITING_GUIDE.md, LESSON_CONTENT_IMPROVEMENT_RESULTS.md를 읽고 양쪽 Git과 최신 Site 상태를 확인하세요. LESSON_CONTENT_IMPROVEMENT_PLAN.md와 LESSON_CONTENT_REVIEW_RESULTS.md는 당시 개선 근거이며 그 안의 미착수 표현을 현재 상태로 해석하지 마세요. 완료한 차시를 다시 처음부터 구현하지 마세요.

학생 전원 Canva 계정과 AI 코드가 준비되어 있고 5~10차시는 웹→Canva 실제 제작·시험·수정→웹으로 운영합니다. 공유 실행 URL과 수정 가능한 원본 프로젝트/AI 코드 대화를 구별하세요. 과거 웹 체크를 새 실제 수행 증거로 해석하지 마세요. 실제 Canva 앱 성공·짝 의견·학생 시간/효과는 개발 검증에서 확인하지 않았습니다. 다음 관찰에서는 생성/수정 대기, 작은 시험, 40분 완료/미완료와 학생 근거를 수집해 추가 수정 범위를 정하세요.

기존 lesson_no, activity_data 키·타입·배열의 순서/의미·정답·단계·배점·필수 수·기본값/복원과 인증·자동 저장·큐·재시도·로드 실패 보호·이탈 경고·수정 후 완료 해제를 보존하세요. 실제 학생 기록 삭제/초기화, 새 Site, 프레임워크 교체, 불필요한 DB/RLS/계정·교사 권한 변경을 하지 마세요. 완료된 권한/version39 작업은 재적용하지 마세요.

루트와 web은 별도 Git입니다. 기존 미커밋 문서, web/supabase/tests/, tests/staff-access-live.mjs, 이전 staging/archive를 보존하세요. 비밀정보와 실제 학생 상세/CSV를 열거나 출력하지 마세요. 검증에는 전용 계정만 사용하고 로그아웃하세요.

최종 전체 build·회귀31개·차시별 UI/공개 저장 복원이 통과했습니다. 2~7 page의 기존 lint 오류, 홈 진도 정적 표시는 별도 항목입니다. 알려진 문제와 검증하지 않은 범위는 SESSION_HANDOFF.md를 따르세요. 새 콘텐츠를 수정한다면 관련 검증 후 같은 Site에 게시하고 결과/재개 문서를 최신 상태로 갱신하세요.

최근 게시판 링크 수정은 version51에 반영되었습니다. REFLECTION_BOARD_LINK_FIX_RESULTS.md를 참고하세요. 공통 게시판 컴포넌트의 버튼 렌더링 경고는 해당 링크 교체로 제거했으며 전체 lint는 기존 staging 산출물로 실패합니다.
