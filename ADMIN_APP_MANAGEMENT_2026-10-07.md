# 관리자 앱 보관함 관리 개선

2026-10-07(KST), 운영 DB 적용 및 기존 사이트 version55 배포 완료.

- 공개 URL: https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site
- Site: `appgprj_6a962dcd21f08191876edad89331f7c3`, public 유지
- 소스: `c36d5d5b434d3d691611a0c961dc341c29a5fd4a`
- 버전 ID: `appgprj_6a962dcd21f08191876edad89331f7c3~appgver_1b65aaa7657481919f2cf100664ec11b`
- 성공 배포: `appgdep_6ac5c08f41588191b48c98cf69fac616`, 환경 revision2

## 변경

관리자 메뉴의 ‘앱 보관함’에서 학생 이름·번호·계정·앱 이름·주소 검색, 학급/차시/표시 상태 필터, 정렬, 개수와 50개 단위 페이지를 제공한다. 앱 이름·차시·링크 수정, 개별/일괄 숨김·복원·완전 삭제, 사유 입력과 처리 기록 조회를 추가했다. 완전 삭제는 확인 문구가 필요하며 보관함 행만 물리적으로 제거한다. 외부 서비스의 앱, 학생 계정, 수업 진도와 활동 데이터는 삭제하지 않는다. 감사 기록은 삭제 후에도 남고 앱 이름·URL을 복제하지 않는다.

학생 화면은 새 앱 등록과 열기만 제공한다. 기존 소스에 남아 있던 학생 수정·휴지통 UI와 쓰기 함수를 제거했으며, DB의 학생 UPDATE/DELETE를 회수했다. INSERT도 user_id/title/lesson_no/url 컬럼만 허용하고, 학생 본인·비익명 계정 확인을 적용한다. 숨긴 앱은 학생에게 조회되지 않는다. 기존 숨김 기록을 임의로 복원하거나 삭제하지 않았다.

관리자 RPC는 기존 is_class_staff/can_manage_student 권한을 사용한다. 최고관리자는 전체, 교사는 담당 학급만 조회·관리한다. 잠금 조회부터 대상 학급 범위를 적용하고 스냅샷의 관리 버전/시각을 비교한다. 실패한 일괄 작업은 변경과 감사 기록이 함께 롤백된다. URL 사용자명/비밀번호 및 비http(s) 링크를 차단한다. URL 검증 trigger는 신규 등록 또는 URL 변경 시 적용해 이전 링크도 숨김·복원할 수 있게 했다.

## 파일과 검증

- UI: `web/components/admin-student-apps.tsx`, `web/app/admin/page.tsx`, `web/app/my-apps/page.tsx`
- 클라이언트: `web/lib/admin-student-apps.ts`, `web/lib/student-apps.ts`
- 적용 SQL: `web/supabase/migrations/20261007_app_management.sql`, `web/supabase/schema.sql`에 동일 내용 추가. 이미 적용했으므로 재적용하지 않는다.
- 합성 데이터 테스트: `web/supabase/tests/app_management.sql`. 마이그레이션과 테스트를 한 트랜잭션에서 실행해 **47개 모두 통과**, 전체 rollback 후 마이그레이션만 운영 적용. 실제 학생 앱을 수정/삭제하지 않았다.
- 실제 인증 HTTP 테스트: `web/tests/app-management-live.mjs` 통과. 비로그인/학생 관리 거부, 관리자 조회/통계, 없는 대상/빈 일괄 처리 거부를 확인한다. 운영 데이터 쓰기 없음, 세션 로그아웃 완료.
- 변경 파일 lint, 전체 TypeScript, 최종 npm build, diff 공백 검사 통과. 전체 기존 lint 통과를 의미하지 않는다. Sites 빌드 helper의 이전 Windows npm.cmd 경로 문제 때문에 정상 npm build 결과를 사용했다.
- 로컬 UI: 검색/초기화, 페이지 선택, Enter 수정 대화상자, 수정 입력 후 취소, 사유+완전 삭제 문구의 실행 버튼 제어 후 취소, 학생 수정/삭제/휴지통 조작0개 확인. 375px 모바일에서 가로 잘림 없음. 관리자/학생 로그아웃, viewport와 Git exclude 복원, 개발 서버 종료 완료.
- 읽기 전용 동료 검토의 URL legacy 숨김, 권한 밖 잠금, 페이지 상한 문제를 수정했고 최종 검토에서 추가 결함 없음.
- 화면 증거: `web/outputs/app-management/admin-desktop.jpg`, `admin-mobile.jpg`, `student-desktop.jpg`.

Sites native 도구의 version55 배포 상태가 succeeded이고 동일 공개 URL을 반환했다. 배포 후 추가 브라우저 테스트는 최신 Sites hosting 지침에 따라 실행하지 않았다.

## 남은 로컬 산출물

이번 임시 파일 삭제는 자동 승인 검토에서 일반 정책 차단으로 거부되었다. 우회하지 않아 `web/tsconfig.tsbuildinfo`, `web/outputs/app-management/site-v55-20261007.tar.gz`, `git-exclude-before`가 남았다. 이 파일들은 배포 소스에 포함되지 않았다. 기존 미추적 `web/tests/staff-access-live.mjs`와 과거 임시 산출물도 보존했다. 루트 문서는 미커밋 상태로 유지한다.
