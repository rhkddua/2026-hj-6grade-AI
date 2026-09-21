# 차시별 콘텐츠 편집 가이드

이 문서는 1~10차시의 설명, 활동, 퀴즈, 성찰을 세부 조정할 때 필요한 최소 작업 범위만 정의한다.

## 1. 한 차시만 읽기

세션 시작 시 전체 차시 소스를 읽지 않는다. 사용자가 지정한 차시의 파일과 직접 연결된 공통 파일만 연다.

| 차시 | 화면 파일 | 활동·검증 파일 |
|---|---|---|
| 1 | `web/app/lesson/1/page.tsx` | 화면 파일 내부 |
| 2 | `web/app/lesson/2/page.tsx`, `content.tsx` | `web/lib/lesson-two.ts` |
| 3 | `web/app/lesson/3/page.tsx`, `content.tsx` | `web/lib/lesson-three.ts` |
| 4 | `web/app/lesson/4/page.tsx`, `content.tsx` | `web/lib/lesson-four.ts` |
| 5 | `web/app/lesson/5/page.tsx`, `content.tsx` | `web/lib/lesson-five.ts` |
| 6 | `web/app/lesson/6/page.tsx`, `content.tsx` | `web/lib/lesson-six.ts` |
| 7 | `web/app/lesson/7/page.tsx`, `content.tsx` | `web/lib/lesson-seven.ts` |
| 8 | `web/app/lesson/8/page.tsx`, `content.tsx` | `web/lib/lesson-eight.ts` |
| 9 | `web/app/lesson/9/page.tsx`, `content.tsx` | `web/lib/lesson-nine.ts` |
| 10 | `web/app/lesson/10/page.tsx`, `content.tsx` | `web/lib/lesson-ten.ts` |

추가로 읽는 경우:

- 차시 제목·홈 카드 변경: `web/app/page.tsx`
- 저장 구조·완료 값 변경: `web/lib/lesson-progress.ts`
- 관리자 표시 영향: `web/lib/admin-dashboard.ts`, `web/app/admin/page.tsx`
- 스타일 공통 변경: 실제 import 관계를 검색한 뒤 해당 파일만 읽는다.

## 2. 편집 전 짧은 분석

코드를 바꾸기 전에 다음만 정리한다.

- 학습 목표 한 문장
- 현재 단계 수와 단계별 핵심 활동
- 필수 입력·선택·퀴즈·성찰
- 완료 조건
- 사용자가 요청한 `유지 / 수정 / 추가 / 삭제`

명시되지 않은 다른 차시의 문구나 구조를 함께 고치지 않는다.

## 3. 콘텐츠 품질 기준

- 6학년 학생이 한 번 읽고 해야 할 행동을 이해할 수 있는 문장으로 쓴다.
- 설명보다 학생이 직접 선택·작성·확인하는 활동을 우선한다.
- 같은 개념을 이름만 바꿔 반복하는 활동은 줄인다.
- 새 활동은 학습 목표 또는 완료 조건과 직접 연결한다.
- 오답 피드백은 정답만 말하지 말고 이유와 다음 행동을 안내한다.
- 실제 이름, 연락처, 주소, 비밀번호, 얼굴 사진 등 개인정보를 요구하지 않는다.
- 외부 AI 결과는 학생이 확인·수정하도록 안내한다.

## 4. 저장 호환성

- 기존 `lesson_no`를 바꾸지 않는다.
- 가능하면 기존 `activity_data` 키와 타입을 유지한다.
- 필드를 삭제하더라도 과거 저장 데이터 복원이 실패하지 않도록 기본값과 타입 검증을 둔다.
- 단계 수를 바꾸면 복원된 `current_step`을 새 범위로 제한한다.
- 퀴즈 수·배점을 바꾸면 `quiz_score`, 완료 조건, 관리자 표시를 함께 확인한다.
- 완료에 필요한 입력을 추가하거나 삭제하면 `completed` 계산과 수정 후 완료 해제를 함께 갱신한다.
- 저장 데이터 구조를 깨는 변경은 구현 전에 사용자에게 영향 범위를 알린다.

## 5. 검증 범위

문구만 바뀌어도 관련 파일 lint와 build는 실행한다.

```powershell
cd "C:\Users\rhkdd\OneDrive\문서\2학기 전학공\web"
npx oxlint app/lesson/<번호>/page.tsx app/lesson/<번호>/content.tsx lib/lesson-<이름>.ts
npm run build
```

1차시는 실제 존재하는 파일만 lint한다.

활동·단계·저장 구조를 바꾼 경우 해당 차시에서 다음을 확인한다.

1. 미로그인 접근이 `/login`으로 이동
2. 단계 이동과 키보드 조작
3. 800ms 자동 저장과 저장 상태 문구
4. 새로고침 후 단계·선택·작성 내용 복원
5. 오답·미완료 완료 차단
6. 완료 저장
7. 완료 후 수정 시 `completed = false`
8. 모바일 폭

공통 인증·저장·홈·관리자 코드를 수정했을 때만 영향받는 다른 차시와 관리자 화면까지 회귀 범위를 넓힌다.

## 6. 배포와 문서화

- 사용자가 로컬 전용 작업을 요청하지 않았다면 기존 Sites 프로젝트에 배포한다.
- 새 Site를 만들지 않고 `public` 접근 범위를 유지한다.
- 현재 설치된 Sites 스킬의 배포 절차를 따른다.
- 배포 후 공개 URL에서 수정한 차시의 핵심 동작을 한 번 확인하고 로그아웃한다.
- `SESSION_HANDOFF.md`는 현재 상태와 최근 변경만 짧게 갱신한다. 과거 작업 내용을 계속 누적하지 않는다.
