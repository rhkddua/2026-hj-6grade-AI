# 담임교사 반별 관리자 권한 — 인수인계

2026-10-05 KST. 반별 권한 구현·운영 DB 적용·기존 Site version 39 배포 완료.

최신 결과: `TEACHER_CLASS_ACCESS_RESULTS_2026-10-05.md`. DB 역할/JWT 시뮬레이션 88개와 최고관리자·학생 실제 API/운영 화면을 검증했다. hj601 교사 실제 비밀번호 로그인, 운영 대시보드의 1반 26명/1개 학급 범위, 전용 테스트 글 실제 게시판 조회·숨김/복원·감사 기록 조회도 확인하고 로그아웃했다. 다른 교사 실제 로그인과 교사 토큰 직접 HTTP 우회 검증은 별도 확인 대상이다. 아래는 기존 요구·설계 배경이며 재적용 지시가 아니다.

## 확정 요구와 현재 상태

- hj601@admin.com ~ hj607@admin.com Auth 계정 7개 존재를 Supabase 화면에서 확인했다. 비밀번호는 사용자가 직접 설정했으며 로컬에 저장하지 않았다. 현재 teacher 역할과 UID별 담당 반 배정까지 운영 적용했다. 계정을 다시 만들거나 비밀번호를 변경하지 않는다.
- 601은 6학년 1반, 602는 2반, 같은 방식으로 607은 7반만 조회·관리한다. 기존 최고관리자는 모든 반의 권한을 유지한다.
- 담당 반의 학생 목록·상세·차시 진도·집계·성찰·CSV·게시판 작성 계정 조회·글 숨김/복원·처리 기록을 제공한다.
- 반별 제한은 화면 필터 외에 DB RLS와 모든 관련 RPC에서 강제한다.
- 학생 점수/완료 기록 직접 수정, 계정 삭제, 교사 권한 편집 기능은 추가하지 않는다.
- 7개에 super_admin을 부여하는 SQL은 실행하지 않았다. 사용자의 반별 제한 요청이 이전 전체 권한 부여안과 확인 질문을 대체했다.
- scripts/grant_teacher_admins_20261005.sql은 폐기된 전체 반 최고관리자 부여안이므로 실행하지 않는다. Supabase SQL Editor에 준비했던 쿼리도 실행하지 않는다. 해당 임시 탭은 닫았다.
- 다음 세션에서 Auth 계정 존재·이메일 인증 상태·staff 역할을 읽기 전용으로 재확인한다. 계정 생성과 앱 관리자 역할 부여는 별개다.

## 운영 기준

- 기존 Site: appgprj_6a962dcd21f08191876edad89331f7c3, public, version 39.
- 소스 커밋: 515f0f95a514850a4df71ab92d8a6e89245703e8.
- 공개 주소: https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site
- Supabase: ujhcwxscxepbttqcysal.
- version 38 게시판/중재/감사/익명/권한 검증은 ADMIN_IMPROVEMENTS_2026-10-05.md 참조. CSV 수식 방어 테스트 통과, 내장 브라우저 실제 다운로드 완료는 미확인.

## 반영 완료한 설계 배경

1. staff_profiles의 teacher/super_admin 역할과 teacher_class_assignments 담당 학급 연결을 사용한다. 기존 teacher를 사용하고 사용자 ID와 담당 학년·반을 DB에서 연결한다. 교사가 자신의 배정을 편집할 수 없게 한다. 이메일 규칙은 최초 배정에만 쓰고 실제 요청 권한은 auth.uid()로 검사한다.
2. web/lib/admin-auth.ts와 web/app/admin/login/page.tsx는 read_staff_access RPC로 super_admin과 담당 학급이 있는 teacher를 허용한다. web/lib/student-auth.ts의 직원 라우팅도 같은 RPC를 사용한다. teacher 로그인·관리자 세션·담당 반 표시를 지원한다. 학급 배정 없는 teacher는 접근을 거부한다.
3. web/lib/admin-dashboard.ts는 student_profiles와 lesson_progress를 직접 조회해 집계한다. RLS로 담당 반 행만 반환하고 CSV·통계도 이 범위로 제한한다. 기존 super_admin 정책과 학생 본인 저장 정책을 유지한다. 조회 기능을 위해 교사에게 학생/진도 테이블 FOR ALL 권한을 주지 않는다.
4. read_admin_reflection_board, moderate_lesson_reflection, read_admin_reflection_audit는 security definer이며 is_class_staff와 can_manage_student로 관리자 자격·담당 학급을 검사한다. 조회·대상 글 중재·감사 모두 같은 범위를 적용한다. 타 반 ID/검색어/차시/offset 요청으로 정보가 노출되거나 수정되지 않게 한다. 기존 중재 충돌 검사와 감사 기록을 유지한다.
5. 신규 마이그레이션과 web/supabase/schema.sql을 일치시킨다. 기존 7개 Auth 계정에 teacher 역할 및 담당 6학년 1~7반 배정을 등록한다. 기존 최고관리자 역할은 변경하지 않는다.

## 후속 검증 시 유지할 범위

- 관련 lint, 타입 검사, 전체 build 및 기존 최고관리자·학생 동작 회귀 검증.
- 1반·2반 교사 각각의 담당 반 조회와 타 반 직접 REST/RPC 학생·진도·게시글·감사 조회/중재 차단을 검증한다. 배정 변경 요청, 배정 없는 교사, 비로그인·학생 접근 차단도 확인한다.
- 수정 테스트는 전용 테스트 글만 사용하고 원래 상태로 복원한다. 실제 학생 기록을 변경하지 않고 전체 학급 CSV를 테스트 목적으로 다운로드하지 않는다.
- 새 교사 계정 비밀번호를 채팅으로 요청하거나 저장하지 않는다. 실제 로그인 입력은 사용자가 브라우저에서 직접 진행하도록 안내한다. DB 역할 시뮬레이션은 실제 로그인 검증과 구분해 기록한다.
- 브라우저 DB 권한 변경은 구체적인 반별 변경안을 준비한 뒤 해당 세션의 실행 직전 확인 정책을 따른다. 이전 전체 반 권한 확인을 재사용하지 않는다.
- 검증 후 기존 Site에 public으로 배포하고 운영 경로를 재확인한다. 새 Site를 만들지 않는다. 테스트 세션은 로그아웃한다.

## 환경과 보존

- 루트와 web는 별도 Git 저장소다. 양쪽 status를 확인하고 기존 미커밋 작업을 보존한다.
- TEST_ACCOUNT.md와 web/.env.local의 비밀값을 출력하거나 문서에 복사하지 않는다. service_role을 클라이언트에 넣지 않는다.
- 새 세션에 설치된 Sites 스킬을 따른다. 이전 Windows 패키징에서 Git Bash 경로를 프로세스 PATH에 추가하고 TAR_OPTIONS=--force-local을 사용했다. npm 경로 문제로 node node_modules/vinext/dist/cli.js build를 사용했다. 다음 환경에도 필요하다고 가정하지 않는다.
