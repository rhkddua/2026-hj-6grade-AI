# 2차시 구현 진행 상태 — 2026-09-17

## 작성한 기능
- 40분, 5단계: 생각 열기 → 텍스트/블록/AI 비교 시뮬레이션 → 특징 분류 6개 → 학생 비교 문장 3개 → 퀴즈 3개와 성찰.
- AI 체험은 준비된 결과를 보여 주는 시뮬레이션임을 명시.
- Supabase의 기존 lesson_progress 행에 activity_data JSONB를 추가하여 답안, 체험 성공, 비교표, 채점 확인을 저장하는 코드.
- 800ms 자동 저장, 순차 저장, 저장 실패 재시도, 불러오기 실패 시 덮어쓰기 차단, 미저장 상태 이탈 경고.
- 모든 체험/분류/비교표/퀴즈/성찰 조건을 충족해야 완료 저장 가능.

## 남은 작업 (완료 아님)
1. Supabase 마이그레이션 적용 완료. 사용량 재설정 후 사용자 지시에 따라 SQL Editor에서 실행하고 `Success. No rows returned`를 확인했다. information_schema 조회로 activity_data / jsonb / NOT NULL / '{}' 기본값을 확인했다.
2. 당시 문서 작성 시점에는 테스트 계정이 없었으나, 2026-09-18 현재 별도 테스트 계정과 학생 프로필을 등록했다. 최신 계정 정보는 루트의 `TEST_ACCOUNT.md`를 확인한다.
3. 공개 버전 6 배포 성공. URL: https://hj-ai-coding-class-2026.rhkdduavud.chatgpt.site/lesson/2 . 비로그인 접근 시 /login으로 이동하는 것을 실제 브라우저에서 확인했다.
4. 2026-09-18 현재 테스트 계정 생성 및 학생 프로필 등록이 완료되었다. 4차시 구현·공개 배포 상태는 `SESSION_HANDOFF.md`의 최신 기록을 기준으로 한다.

## 확인한 사항
- 구현 후 Vinext 빌드 성공.
- 순수 로직 검사: 미완료 차단, 전체 조건 충족, JSON 왕복 복원, 오답 차단, 잘못된 저장값 복원 통과.
- 새 코드의 TypeScript 오류 수정. 전체 타입 검사는 기존 홈/1차시 ProgressValue children 오류와 lib/supabase.ts ImportMeta.env 타입 선언 누락 때문에 아직 실패한다.
- GitHub 커밋/푸시하지 않았다. 시작 시 작업 트리는 깨끗했다(이전 인수인계 문서의 미커밋 목록과 달랐음).
- Sites 배포 전용 저장소에는 2c081e13729d5fb0b3d7db1a465c2c5ed1b76e8f를 푸시했다. 버전 6 배포 appgdep_6aab66a639d88191a9fd06889a6c617f는 succeeded. 임시 web/.git 및 site.tar.gz는 제거했다.
