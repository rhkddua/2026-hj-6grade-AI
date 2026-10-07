# 학생 상세의 삭제 게시글 재표시 수정

2026-10-07(KST), 운영 DB 적용 및 기존 사이트 version56 배포 완료.

- URL: https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site
- Site: `appgprj_6a962dcd21f08191876edad89331f7c3`, public 유지
- 소스: `84302abf7321f03417a5d0b5995bd9654c1ed349`
- 버전: `appgprj_6a962dcd21f08191876edad89331f7c3~appgver_aab447ddd79c8191b33c66e1611e9ae5`
- 성공 배포: `appgdep_6ac5c469e4f88191bf6e1e6c3e8daa67`, 환경 revision2

## 원인과 수정

관리자 학생 현황 → 상세 → 보기는 대시보드에서 읽은 `lesson_progress.reflection` 원본을 표시했다. 게시판 완전 삭제는 별도 `lesson_reflection_board` 행만 제거하므로 수업 저장본과 대시보드 캐시에서 같은 문장이 계속 나타났다.

대시보드 진도 조회에서 성찰 본문을 제외하고, 상세 창을 열 때마다 새 `read_admin_student_detail` RPC로 현재 게시 상태를 조회하도록 바꿨다. 담당 학급/직원 권한 및 학생 존재 여부를 검사한다. 현재 게시글이 있으면 해당 본문과 공개/숨김 상태를 사용한다. 게시글이 없고 완전 삭제 감사 기록이 있으면 본문을 NULL로 반환하고 ‘완전 삭제됨’ 상태만 제공한다. 삭제 후 새 글을 명시적으로 게시하면 현재 새 글을 사용하며 이전 수업 저장본으로 되돌아가지 않는다. 게시한 적 없는 성찰은 기존 조회 기능을 유지한다.

상세 컴포넌트를 학생 ID로 구분하고 이전 요청 응답을 무시한다. 조회 중/실패 시 이전 본문을 표시하지 않고, 상세 새로고침도 추가했다. 진도·점수·완료·원본 성찰·활동 JSON은 수정하거나 삭제하지 않았다. 앱 보관함의 학생 등록 전용 제한과 기존 관리 권한도 유지한다.

## 검증

- SQL: `web/supabase/tests/admin_student_detail.sql`, 합성 계정/수업/게시글만 사용하여 모든 변경 rollback. **26개 통과**: 삭제 후 본문 NULL, 반복 조회, 새 글 재게시, 미공유 성찰, 숨김/복원, 원본 수업 데이터 정확한 보존, 학생/익명/미배정/다른 학급/없는 학생 조회 거부.
- 최종 마이그레이션 `web/supabase/migrations/20261007_admin_student_detail.sql` 운영 적용 성공. schema.sql에 동일 내용 포함. 재적용하지 않는다.
- 실제 인증 읽기 전용 API `web/tests/admin-student-detail-live.mjs` 통과: 접근 차단, 현재 게시글과 본문/상태 일치, 삭제 상태 본문 없음, 수업 단계/점수/완료/시각 일치, 반복 조회. 모든 인증 세션 로그아웃.
- 변경 파일 lint, 전체 TypeScript, 최종 build, diff 공백 검사 통과. 기존 전체 lint 통과를 의미하지 않는다. 이전 Windows Sites helper npm.cmd 경로 문제 때문에 정상 npm build 결과를 재사용했다.
- 실제 전용 테스트 학생에서 삭제 상태10개를 확인. 관리자 같은 세션에서 게시판 → 학생 현황 → 상세 재열기, 상세 새로고침 중 본문 제거, 페이지 reload 후 다시 상세 열기에도 삭제 상태10개와 본문 없음 확인. 기존 학생/게시글/앱을 변경하거나 삭제하지 않았다.
- Enter로 상세 열기, 375px에서 가로 잘림 없음 확인. 실패 주입 및 다른 실제 학생 전환 테스트는 실행하지 않았으며 오류/오래된 응답 보호는 코드와 동료 검토로 확인했다.
- 화면 증거: `web/outputs/student-detail-fix/admin-detail-desktop.jpg`, `admin-detail-mobile.jpg`.
- 관리자 로그아웃, viewport 원복, 임시 브라우저 탭 종료, 개발 서버 종료, Git exclude 원복 완료. 기존 미추적 staff-access-live.mjs와 tsconfig.tsbuildinfo 보존.

Sites native 배포 결과가 succeeded이며 동일 공개 URL을 반환했다. 배포 후 추가 브라우저 접속은 최신 Sites hosting 지침에 따라 실행하지 않았다. 이번 배포 압축파일의 삭제는 자동 승인 검토에서 일반 정책 차단으로 거부되어 `web/outputs/student-detail-fix/site-v56-20261007.tar.gz`가 남았다. 우회하지 않았고 배포 소스에 포함되지 않았다.
