# AI 코딩 교실 1~10차시 활동 내용 검토 결과

최초 검토: 2026-10-05(KST). Canva 관련 재검토: 2026-10-06(KST). 대상: 초등학교 6학년, 차시당 40분. **콘텐츠 검토만 수행했으며 웹 소스·DB·학생 기록 수정 및 배포는 하지 않았다.**

## Canva 운영 전제 정정과 이번 재검토 범위

사용자가 **학생 모두 Canva 계정을 보유하고 Canva AI 코드 기능의 정상 작동을 확인했으며, 관련 활동은 웹사이트와 Canva 화면을 오가며 진행한다**고 알려 주었다. 이를 확정된 수업 운영 전제로 반영했다. 이번에는 Canva 제작·시험·공유와 연결된 **5~10차시와 관련 종합 판단만 재검토**했다. 1~4차시의 활동·판정·시간표·운영안은 이전 검토 그대로 유지했다. Canva를 직접 명시하는 5~6차시뿐 아니라 그 뒤의 기능 설계·두 기능 제작·개인 앱·공유와 개선까지 이어지는 활동을 관련 범위로 보았다.

기존 검토의 “웹 정적 예시가 작동하지 않으므로 실제 앱 시험·개선이 이루어지지 않는다”, “Canva 제작은 새로 추가할 별도 활동이다”, “종이 모형을 기본으로 운영한다”는 판단을 철회했다. 웹의 예시 화면은 준비·설명용이고, 학생이 실제로 조작하는 앱은 Canva에서 만든 앱이다. **웹 안내·계획·제작 지시 → Canva 생성·실행·수정 → 웹 결과 기록·퀴즈·성찰**을 하나의 수업으로 평가한다. 계정·AI 기능 준비를 다시 요구하거나 그 비용을 수업 시간에 넣지 않는다.

## 검토 방법과 판단의 한계

- 지정된 [web/AGENTS.md](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/AGENTS.md>), [SESSION_HANDOFF.md](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/SESSION_HANDOFF.md>), [LESSON_EDITING_GUIDE.md](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/LESSON_EDITING_GUIDE.md>), [LESSON_CONTENT_REVIEW_PLAN.md](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/LESSON_CONTENT_REVIEW_PLAN.md>), [NEXT_SESSION_PROMPT.md](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/NEXT_SESSION_PROMPT.md>)를 읽고 처음에는 1→10차시의 화면·활동·검증 파일을 확인했다. 이번에는 Canva 관련 소스와 완료 조건을 다시 읽었다. 제목·순서는 [web/app/page.tsx:31](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/page.tsx:31>)부터 확인했다.
- 로컬 `web` HEAD는 `515f0f95a514850a4df71ab92d8a6e89245703e8`로 인수인계의 version 39 소스와 일치했다. 이번 재검토에서 운영 사이트·Canva를 브라우저로 재실행하거나 학생 기록을 열지는 않았다.
- **사용자 확인 사실:** 전원 Canva 계정 보유, Canva AI 코드 정상 사용 가능, 두 화면을 이동하는 수업 방식. 이는 사용자가 확인한 운영 조건이며 내가 직접 관찰한 수업 결과로 표현하지 않는다.
- **소스 확인 사실:** 웹 안내·선택지·입력 기준·피드백·완료 계산·저장 데이터. 예시 버튼의 이벤트 유무는 웹 예시의 속성일 뿐 Canva 앱의 동작 여부를 판단하는 근거가 아니다. 앱 보관함은 이미 5~10차시 작품 링크의 등록·다시 열기를 제공한다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)).
- **설계 추정:** 아래 시간 범위·40분 배분·지원 필요·교육 효과·흥미 판정. 실제 학생 수행 시간·참여도·작품 향상은 측정하지 않았다. 모든 차시의 **실제 수업 관찰 결과는 없음**이다.
- **남은 미확인:** 학생별 읽기·타이핑·화면 전환 숙련, 생성·수정 대기 시간, 학생별 앱의 기능·예외 처리 성공, 실제 짝 피드백과 수정 전후 결과. Code 기능의 정상 사용 가능성과 개별 앱의 모든 요구 조건 충족은 구분한다.
- 판정은 **적절 / 보완 필요 / 우선 개선 / 판단 유보**다. 이는 설계 판단이며 실증된 효과를 뜻하지 않는다. 실제 효과·흥미의 크기와 수업 시간은 관찰 전까지 판단 유보한다.

## 시간표 읽는 방법과 운영 전제

학생 1인 1기기, 준비된 사이트·Canva 계정과 정상 작동하는 Canva AI 코드, 교사의 짧은 설명·개별 지원을 전제한다. 5~10차시에서는 **Canva 앱 열기, 지시 옮기기, 생성 대기, 실행·관찰, 수정 요청·재생성·재시험, 웹 복귀·저장까지 포함**한다. 계정 발급·AI 권한 확인은 이미 준비된 조건이므로 제외한다. 로그인 세션 유지 여부를 실측한 것은 아니므로 두 화면 열기·세션 확인은 접속·전환 시간에 포함하고, 예외적인 세션 복구가 발생하면 별도 지연으로 기록한다.

각 활동은 읽기·이해→선택/작성/조작→결과 확인을 고려했다. 빠름은 이해·입력·전환이 익숙한 경우, 일반은 짧은 설명과 가벼운 재시도, 지원은 재읽기·타이핑 도움·생성 실패·수정 재시도가 필요한 경우다. 통계적 평균이나 백분위가 아니다. 합계는 각 활동 범위의 최솟값·최댓값을 합산했다. 생성 대기와 다른 일을 병행해 시간을 줄인다면 차시 운영안에 명시하며 같은 시간을 두 번 계산하지 않는다.

**시간 추정의 기준을 통일했다.** 1~4차시는 기존 웹 활동 기준, 5~10차시는 웹과 Canva 통합 수업 기준이다. 후반 시간에 기존 정적 예시 검사와 Canva의 같은 검사를 모두 더하지 않는다. 예시는 짧게 참고하고 실제 시험은 자기 Canva 앱에 수행한다. 5·6·8·9차시의 신규 제작 추정과 6·7·10차시의 기존 작품 재사용 운영안을 구분한다. 기존 앱을 수정하는 시간표는 같은 학생이 원본 Canva 프로젝트 또는 AI 코드 대화를 다시 열 수 있다는 가정이다. 앱 보관함의 공유 URL은 실행·시험·발표에 활용할 수 있으나 원본 편집 화면 접근을 보장하지 않는다. 기존 앱 재사용과 제시된 시간 내 생성·수정 완료는 운영안의 가정이지 학생 실측 사실이 아니다.

**수업 수행과 시스템 완료를 구별한다.** Canva에서 실제 시험했다면 웹의 체크 항목을 그 시험 결과에 따라 기록할 수 있다. 웹 완료 함수가 Canva를 호출하거나 작품을 검사하지 않는다는 이유로 외부 수행을 인정할 수 없다고 판단하지 않는다. 다만 체크·글자 수·퀴즈 충족은 자기보고와 형식 확인이므로 작품 품질을 자동 인증하는 것은 아니다. 5~7차시의 “바뀌는지/나타나는지 확인했어요”는 검사 수행 진술로, 실패를 관찰했어도 사실대로 체크할 수 있다. 8~9차시의 “결과가 나타나요”, 10차시의 “개선했어요”는 해당 동작·개선이 실제 이루어진 경우에 기록한다. 실제 Canva 작업을 하지 않은 예시 읽기·종이 모형은 별도 모의 활동이다.

40분 운영안은 **교사의 진행 제안**이며 현재 웹에 자동 구현되었다는 뜻이 아니다. 현재 필수 입력·퀴즈·성찰을 생략하는 방식으로 시간을 줄이지 않는다. 시간 제한은 성공 보장이 아니며, 실행·수정이 끝나지 않으면 남은 작업을 기록하고 다음 수업으로 이어 간다. 게시판 전송은 선택이고 완료 조건과 독립적이다([web/components/reflection-board-actions.tsx:33](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/components/reflection-board-actions.tsx:33>), [web/components/reflection-board-actions.tsx:66](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/components/reflection-board-actions.tsx:66>)). 앱 보관함 링크 등록 역시 현재 차시 완료와 별개인 기존 기능이며 아래 운영안에서 필요한 경우만 시간을 배분한다.

## 1~10차시 전체 요약

시간은 **빠름 / 일반 / 지원** 추정(분)이다. 1~4차시는 이전 검토를 유지했고, 5~10차시는 웹↔Canva 전환과 실제 작업을 포함해 정정했다. 선택적 게시·추가 꾸미기는 제외한다. 7·10차시는 기존 작품 재사용 기준이며 새로 만드는 경우 별도 시간이 필요하다. 세부 근거·활동별 시간·정확히 40분인 운영안은 각 차시 절에 있다.

| 차시·홈 제목 | 검토 목표 | 교육적 효과 | 6학년 수준 | 40분 분량 | 재미·흥미 | 빠름 / 일반 / 지원 | 분량 해석·우선 과제 |
|---|---|---|---|---|---|---|---|
| 1 코딩은 어떻게 발전했을까? | 같은 명령의 표현과 발전 이유 비교 | 보완 필요 | 우선 개선 | 우선 개선 | 보완 필요 | 25~37 / 39~52 / 61~80 | 일반 초과 위험; 세 언어 입력 부담·구체성/순서 평가 연결 |
| 2 전통 코딩과 AI 코딩 | 세 방식의 차이와 사람의 확인 책임 | 보완 필요 | 보완 필요 | 보완 필요 | 보완 필요 | 21~30 / 34~47 / 52~71 | 일반 40분 경계; 비교문 지원·성공 이력과 현재 결과 구분 |
| 3 AI는 무엇을 잘하고 못할까? | AI 도움·한계·안전한 확인 행동 | 우선 개선 | 우선 개선 | 보완 필요 | 우선 개선 | 16~24 / 24~33 / 37~49 | 일반 부족; 안전 선택지 정합·출처 비교 행동 추가 |
| 4 AI에게 잘 지시하는 방법 | 목표·상황·조건·형식으로 요청·수정 | 우선 개선 | 보완 필요 | 보완 필요 | 우선 개선 | 19~27 / 28~38 / 40~55 | 일반 부족 가능; 오답 피드백·놀이 문맥·실제 두 결과 비교 |
| 5 Canva AI 코드 시작하기 | 안전한 지시로 첫 앱을 생성·시험·수정 | 보완 필요 | 보완 필요 | 우선 개선 | 적절 | 24~36 / 36~52 / 53~79 | 실제 제작 포함; 이동 안내·계획/지시/결과 일치·수정 시간 관리 |
| 6 한 기능 앱 만들기 | 입력→처리→결과를 실제 한 기능으로 시험 | 보완 필요 | 보완 필요 | 우선 개선 | 보완 필요 | 24~37 / 37~54 / 54~80 | 신규 생성 기준; 40분안은 원본 재사용·처리/출력 구분 |
| 7 앱 기능 설계하기 | 기존 앱의 사용자 흐름·화면 피드백 개선 | 보완 필요 | 보완 필요 | 우선 개선 | 보완 필요 | 24~37 / 36~53 / 53~79 | 원본 재사용 기준; 처음 사용자의 이해·필수 시험·전환 안내 |
| 8 두 기능 앱 만들기 | 값 전달·5분/15분/미선택을 실제 앱에서 시험 | 보완 필요 | 보완 필요 | 보완 필요 | 적절 | 19~30 / 32~48 / 53~74 | 일반40분 경계; 제작 지시와 세 체크의 기대 결과 맞추기 |
| 9 나에게 필요한 앱 만들기 | 생활 문제의 두 기능 앱 제작·사용·수정 | 보완 필요 | 우선 개선 | 우선 개선 | 적절 | 25~37 / 42~61 / 69~97 | 신규 제작 초과 위험; 문장 재사용·두 기능·수정1회 제한 |
| 10 공유하고 개선하기 | 실제 짝 의견을 받아 Canva 앱 개선·재시험 | 보완 필요 | 보완 필요 | 우선 개선 | 적절 | 23~35 / 38~56 / 64~89 | 9차시 원본 재사용 기준; 동시 짝 발표·작은 개선1회 |

후반 강점은 생활의 문제를 실제 앱으로 만들고 시험·수정하는 경험이다. 기존의 실행 기회 부재·정적 예시 때문에 흥미가 낮다는 판단을 정정했다. 남는 개선 과제는 **웹↔Canva 이동·복귀 안내, 계획과 실제 결과의 일치, 중복 글쓰기, 생성·수정 시간을 포함한40분 운영**이다. 위 ‘적절’은 활동 설계 판정이며 실제 학생 흥미의 측정 결과가 아니다.

## 1차시 — 코딩은 어떻게 발전해 왔을까?

**현재 구성·확인 사실.** 홈 제목은 ‘코딩은 어떻게 발전했을까?’이며 화면 안내는 컴퓨터에게 명령하는 방법이 어떻게 쉬워졌는지 알아보는 것이다. 검토 목표는 같은 명령을 여러 표현으로 비교하여 사람이 더 쉽게 명령하는 이유를 설명하기로 정리했다([web/app/page.tsx:31](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/page.tsx:31>), [web/app/lesson/1/page.tsx:810](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:810>)). 선수 지식은 방향·순서·3+2, 기기 조작이며 영어·이진수 지식은 힌트로 지원한다. 실제 5단계는 ①연필 가져오기 명령 선택과 즉시 피드백 ②기계어→어셈블리어→고급 언어→블록→AI의 설명 카드 ③오른쪽 2칸 이동 선택 4개와 3+2 계산 입력 3개 ④주스 따르기 4명령 재배열 ⑤퀴즈 2개·성찰이다([web/app/lesson/1/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:55>), [web/app/lesson/1/page.tsx:855](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:855>), [web/app/lesson/1/page.tsx:912](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:912>), [web/app/lesson/1/page.tsx:967](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:967>), [web/app/lesson/1/page.tsx:1738](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1738>), [web/app/lesson/1/page.tsx:1815](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1815>); 이 절의 짧은 경로는 `web/app/lesson/` 기준).

**필수·결과물·완료.** 실제 완료 필수는 이동 4개 성공, 수학 3개 성공, 퀴즈 채점·2/2, 성찰 앞뒤 공백 제거 후 10자 이상, 완료 저장이다. 도입 명령 선택·역사 읽기·순서 성공은 수업에 제시되지만 완료에는 포함되지 않는다([web/app/lesson/1/page.tsx:407](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:407>), [web/app/lesson/1/page.tsx:1896](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1896>)). `activity_data`는 `robotChoice`, `order/orderChecked`, `gameChoices/gameChecked/gameSolved/activeGameRound`, `studioView`, `mathInputs/mathChecked/mathSolved`, `quizAnswers/quizChecked`이며 점수는 채점 후 퀴즈 정답 수 0~2, 성찰은 별도 저장한다([web/app/lesson/1/page.tsx:273](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:273>), [web/app/lesson/1/page.tsx:479](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:479>)). FAQ 열기·비교 팝업·성찰 게시가 선택이다([web/app/lesson/1/page.tsx:1059](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1059>), [web/app/lesson/1/page.tsx:1380](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1380>), [web/app/lesson/1/page.tsx:1894](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1894>)). 수학은 수업용 문자열 검증이고 JavaScript 화면은 두 숫자를 더해 출력하는 제한된 모형이다. 자유 코드를 실행하는 환경은 아니다([web/app/lesson/1/page.tsx:213](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:213>), [web/app/lesson/1/page.tsx:652](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:652>), [web/app/lesson/1/page.tsx:1284](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1284>)).

| 기준 | 판정·강점 | 문제점·예상 어려움(추정) |
|---|---|---|
| 교육적 효과 | 보완 필요 — 같은 이동·계산을 비교하고 ‘이전 언어도 함께 사용’한다고 설명한다([web/app/lesson/1/page.tsx:949](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:949>), [web/app/lesson/1/page.tsx:1240](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1240>), [web/app/lesson/1/page.tsx:1704](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1704>)). | 순서·구체성은 완료 조건에 포함되지 않고 계산은 고정된 입력 복사만으로 성공할 수 있다. 이동 오답도 실제 잘못된 위치 대신 출발점에 남는다([web/app/lesson/1/page.tsx:1126](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1126>), [web/app/lesson/1/page.tsx:1234](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1234>)). 학생이 원리를 이해했는지는 별도 설명 증거가 필요하다. |
| 6학년 수준 | 우선 개선 — 계산 방·스피커 비유와 JS 숫자 빈칸이 도움된다([web/app/lesson/1/page.tsx:1332](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1332>), [web/app/lesson/1/page.tsx:1367](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1367>), [web/app/lesson/1/page.tsx:1594](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1594>)). | 첫 수업부터 0/1 세 줄·영어·쉼표·#·줄바꿈을 정확히 입력하는 부담이 크다. 어셈블리 정답은 내부 공백·기호 형태도 요구한다([web/app/lesson/1/page.tsx:223](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:223>), [web/app/lesson/1/page.tsx:229](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:229>)). 읽기·타이핑 숙련 차이에 따라 개념보다 오타 교정에 시간을 쓸 수 있다. |
| 40분 분량 | 우선 개선 — 두 실험실을 한 화면씩 나눈다([web/app/lesson/1/page.tsx:969](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:969>)). | 전체 흐름 일반 추정 39~52분, 지원 61~80분. 최소 완료만 하면 일부 목표 활동을 건너뛰어 시간이 줄지만 수업 목표를 충분히 다뤘다고 보기 어렵다. |
| 재미·흥미 | 보완 필요 — 명령 선택 후 목표 도착, 계산 방 값·출력 확인이 구체적이다([web/app/lesson/1/page.tsx:1132](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1132>), [web/app/lesson/1/page.tsx:1534](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:1534>)). | 네 번 모두 같은 목표, 수학도 같은 값이어서 후반 반복과 필사로 느낄 수 있다. 학생이 새 명령·과제를 만드는 선택권은 작다. 배지 자체의 흥미 효과는 미관찰이다. |

**현재 활동 시간 추정(분).** 학생 실측·수업 관찰 없음. 일반 6학년 기기 사용·교사 안내를 가정하며 읽기/이해→조작→결과 확인을 포함한다. 재시도는 각 활동의 지원 열에 포함하고 저장·단계 전환은 마지막 행에 모아 중복하지 않았다.

| 활동 | 완료 필수 여부 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 접속·목표·조작 안내 | 운영 필수 | 2~3 | 3~4 | 5~6 | 로그인·기록 로드·시범 |
| ①구체적 명령 | 완료 비필수 | 2~3 | 3~4 | 4~6 | 이야기·3선택·이유 확인 |
| ②언어 발전 | 완료 비필수 | 2~3 | 4~5 | 6~8 | 5개 표현 읽고 비교 |
| ③이동 4개 | 필수 | 4~6 | 6~8 | 9~12 | 각 약속 해석·실행·수정 |
| ③수학 3개 | 필수 | 6~9 | 10~14 | 17~22 | 두 세 줄 입력·기호 교정·빈칸 실행 |
| ④순서 4개 | 완료 비필수 | 2~3 | 3~4 | 5~6 | 재배열·피드백·수정 |
| ⑤퀴즈·성찰 | 필수 | 4~6 | 6~8 | 9~12 | 정답 근거·한 문장 작성 |
| 정리·저장·전환 | 운영 필수 | 3~4 | 4~5 | 6~8 | 단계 전환 합산·저장 확인·짧은 여유 |
| **전체 합계** | 전체 수업 흐름 | **25~37** | **39~52** | **61~80** | 일반 상한·지원은 초과 |

완료 필수+운영만 합치면 빠름 19~28 / 일반 29~39 / 지원 46~60분이다. 선택 FAQ·팝업·게시에는 별도 2~5분을 예상하며 위 합계에는 넣지 않았다.

**개선 제안(미구현).** 유지: 동일 결과 비교·즉시 피드백·이전 언어 공존 설명·실제 게임 사례. 축소: 연도 암기나 FAQ 설명을 선택으로 돌리고 역사 설명 4~5→3분, 같은 이동의 반복 설명 6~8→6분. 수정: ‘고급 언어 1970년대~’([web/app/lesson/1/page.tsx:81](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:81>))는 시작 시점으로 오해할 수 있어 “고급 언어는 1950년대부터 등장했어요. 아래는 C 언어의 예예요”처럼 등장 시점·대표 예를 구분한다([IBM Fortran 역사](https://www.ibm.com/history/fortran): 1957 상용 출시 확인). 게임 예시의 ‘대부분 x86 어셈블리’는 [원작자 FAQ](https://www.chrissawyergames.com/faq3.htm)의 99% assembler/machine code 설명으로 확인했다. 그 페이지로 1999 출시·빠른 처리 목적까지 검증한 것은 아니며 현재 FAQ 링크보다 직접 근거 링크를 제안한다. 수학은 ‘한 줄씩 뜻 말하기→입력→계산 방 확인’으로 안내하고 명령 카드·기호 위치 시범을 제공하여 일반 10~14→10분, 지원은 단계별 교사 도움으로 분산한다. 안내 예: “외울 필요는 없어요. 첫 줄은 3 넣기, 둘째 줄은 2 더하기, 마지막은 보여 주기예요. 입력 전에 A가 어떻게 바뀔지 말해 보세요.” 추가: 현재 없는 짝 설명을 성찰 전에 넣어 “쉽게 읽힌 표현 하나와 이유”를 말하게 한다. 빠른 학생은 JS 숫자를 바꾸어 예측·확인하되 3·2로 복귀해 필수 미션을 마치도록 한다. 기계어·어셈블리 다른 계산은 현재 검증기가 허용하지 않으므로 자유 실험으로 안내하지 않는다. 중장기에는 두 수학 모형을 관찰 선택으로 전환하고 JS만 필수로 두면 수학 일반 6~8분으로 줄일 수 있지만 완료 조건 변경을 동반한다.

**40분 운영안(제안).** 접속·목표 3 + 명령 선택·이유 3 + 언어 비교 3 + 이동 6 + 수학 10 + 순서 3 + 퀴즈·짝 설명·성찰 7 + 저장·정리·전환 3 + 여유 2 = **40분**. 일반 진행의 오타가 적은 조건에서 가능한 압축안이다. 지원 학생에게 숫자·명령 카드와 한 줄씩 확인을 제공한다. 부족 시 FAQ·팝업·추가 숫자 실험을 생략하고 필수 입력을 미완료인 채 완료했다고 처리하지 않는다. 저장/접속 실패 시 종이 명령·계산 방 모형으로 학습을 계속하고 온라인 완료는 이후 처리한다. 외부 AI를 쓰는 차시가 아니므로 생성 대기 시간은 없다.

**수정 영향.** 교사 안내·선택 설명은 키·배점 유지 가능. 수학 선택 전환 또는 순서 필수화는 `isLessonComplete/requirements`, 완료 해제·복원 검증, 기존 성공 기록의 인정 기준을 함께 검토해야 한다. JS 숫자 심화 결과와 필수 성공 상태 관계도 확인해야 한다. 게시 여부는 완료와 독립적으로 유지한다. 이번에는 구현하지 않는다.

추가 안내 제안: 이동 모형의 `0001`은 오른쪽 이동이고 계산 모형의 `0001`은 불러오기다([web/app/lesson/1/page.tsx:132](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:132>), [web/app/lesson/1/page.tsx:186](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/1/page.tsx:186>)). 학생에게 “두 활동은 서로 다른 수업용 약속을 사용해요. 0과 1의 뜻은 어떤 명령 약속을 쓰느냐에 따라 달라져요”라고 짚어 공통 기계어 명령인 것처럼 외우지 않게 한다. 40분안의 언어 비교 3분 안에서 다루며 별도 암기·추가 입력을 요구하지 않는다.

## 2차시 — 전통적인 코딩과 AI 코딩

**현재 구성·확인 사실.** 홈은 ‘전통 코딩과 AI 코딩’, 차시 화면 목표는 세 방법의 차이·공통점 설명이다([web/app/page.tsx:32](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/page.tsx:32>), [web/app/lesson/2/page.tsx:225](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:225>), [web/app/lesson/2/page.tsx:253](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:253>)). 선수 지식은 1차시 명령·순서, 반복 횟수·기기 선택·문장 입력. 5단계는 ①AI가 만들 때 사람 역할에 대한 초기 생각 ②텍스트/블록/AI로 “안녕!” 세 줄 만들기 ③특징 6개 분류 ④세 방법 비교 문장 ⑤퀴즈 3개와 사례를 넣은 성찰이다([web/lib/lesson-two.ts:2](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-two.ts:2>), [web/app/lesson/2/content.tsx:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:18>), [web/app/lesson/2/content.tsx:25](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:25>), [web/app/lesson/2/content.tsx:39](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:39>), [web/app/lesson/2/content.tsx:40](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:40>), [web/app/lesson/2/content.tsx:41](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:41>); 짧은 경로는 `web/app/lesson/` 기준). 코드·블록은 반복 횟수 라디오를 바꾸고 AI는 두 요청 중 선택한다. 실제 AI나 코드를 호출하지 않는 준비된 시뮬레이션이다([web/app/lesson/2/content.tsx:12](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:12>), [web/app/lesson/2/content.tsx:30](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:30>), [web/app/lesson/2/content.tsx:32](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:32>)).

**필수·결과물·완료.** 세 방법 모두 3줄 성공 경험, 분류 채점·6/6, 비교 3문장 각 10자 이상, 퀴즈 채점·3/3, 성찰 10자 이상 후 완료 저장. 초기 선택과 성찰 게시는 완료 비필수다([web/lib/lesson-two.ts:38](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-two.ts:38>), [web/app/lesson/2/page.tsx:288](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:288>), [web/app/lesson/2/page.tsx:295](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:295>)). `activity_data`: `opening/runs/textCount/blockCount/aiSpecific/classifications/classificationChecked/comparison/answers/quizChecked`; 비교는 각 300자, 성찰 1000자 제한, 퀴즈 점수 0~3은 채점 뒤 저장한다([web/lib/lesson-two.ts:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-two.ts:16>), [web/app/lesson/2/content.tsx:40](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:40>), [web/app/lesson/2/content.tsx:41](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:41>), [web/app/lesson/2/page.tsx:46](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:46>)). `runs`는 한번 3줄 성공한 이력이며 이후 횟수를 바꿔도 초기화되지 않는다([web/app/lesson/2/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:15>), [web/app/lesson/2/content.tsx:30](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:30>)). 현재 입력값 모두가 목표에 맞는다는 완료 증거와 구별해야 한다.

| 기준 | 판정·강점 | 문제점·예상 어려움(추정) |
|---|---|---|
| 교육적 효과 | 보완 필요 — ‘목표→실행→수정’과 세 방법 모두 사람 확인이 필요함을 체험·퀴즈·성찰로 잇는다([web/app/lesson/2/content.tsx:35](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:35>), [web/app/lesson/2/content.tsx:37](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:37>), [web/lib/lesson-two.ts:12](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-two.ts:12>)). | 방법별 체험은 선택지로 결과를 정하는 모형이어서 직접 텍스트 작성·블록 연결 경험은 없다. 비교 정답표가 앞에 있어 그대로 옮겨도 길이 조건을 충족할 수 있다([web/app/lesson/2/content.tsx:40](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:40>)). 성공 이력과 현재 결과 구분도 약하다. |
| 6학년 수준 | 보완 필요 — 숫자·블록·자연어를 한 목표로 비교해 코드 전체 타이핑 부담을 줄였다([web/app/lesson/2/content.tsx:29](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:29>), [web/app/lesson/2/content.tsx:30](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:30>)). | `for/range/print`, 문법·자연어라는 어휘와 비교문 3개+성찰의 입력 부담. 한 문장에 ‘명령 방법’과 ‘사람 역할’을 함께 넣는 학생은 문장 틀이 필요하다([web/app/lesson/2/content.tsx:40](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:40>)). |
| 40분 분량 | 보완 필요 — 화면 단계시간 5+15+7+8+5=40분으로 제시한다([web/app/lesson/2/page.tsx:259](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/page.tsx:259>)). | 표기된 40분만으로 접속·저장·전환·오답 재시도가 확보됐다고 볼 수 없다. 일반 34~47분, 지원 52~71분 예상. 선택 조작만 빠르게 끝내면 체험 15분은 과대일 수 있다. |
| 재미·흥미 | 보완 필요 — 목표와 다른 결과가 바로 보이고 수정 성공을 경험한다([web/app/lesson/2/content.tsx:35](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/2/content.tsx:35>)). | 세 줄 인사가 반복되고 분류 뒤 제공된 비교를 쓰는 흐름이라 개인 선택·만들기 목적이 약하다. 실제 외부 AI 생성의 재미·지연은 이 차시 근거로 평가할 수 없다. |

**현재 활동 시간 추정(분).** 실측·관찰 없음. 읽기·결과 비교·문장 구상까지 포함하며 지원 열은 오답 재시도와 타이핑 도움을 포함한다.

| 활동 | 완료 필수 여부 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 접속·목표 안내 | 운영 필수 | 2~3 | 3~4 | 4~6 | 로드·반복 목표 설명 |
| ①초기 생각 | 완료 비필수 | 2~3 | 3~4 | 4~6 | 읽기·선택·이유 |
| ②세 방법 실행·수정 | 필수 | 4~6 | 7~10 | 11~15 | 세 탭·목표 불일치·수정 확인 |
| ③6개 분류 | 필수 | 3~4 | 5~7 | 8~10 | 사례 해석·피드백·재분류 |
| ④비교 3문장 | 필수 | 4~6 | 7~10 | 11~16 | 비교·구상·타이핑·다듬기 |
| ⑤퀴즈·성찰 | 필수 | 4~5 | 6~8 | 9~12 | 3문항 근거·경험 문장 |
| 정리·저장·전환 | 운영 필수 | 2~3 | 3~4 | 5~6 | 탭/단계 이동 합산·저장·여유 |
| **전체 합계** | 전체 수업 흐름 | **21~30** | **34~47** | **52~71** | 일반 경계, 지원 초과 |

초기 생각을 제외한 완료 필수+운영은 빠름 19~27 / 일반 31~43 / 지원 48~65분. 선택 게시·초기/마지막 생각 비교는 별도 2~4분이며 합계에 미포함.

**개선 제안(미구현).** 유지: 같은 목표의 세 방법 비교와 AI 확인 책임·방법 간 공존 설명. 축소: ‘어떤 방식인가’ 분류를 교사가 매번 다시 읽지 않고 학생이 이유 하나를 묶어 설명하게 해 일반 5~7→5분. 문장 틀로 비교 작성 7~10→6~8분을 목표로 하되 단순 복사 대신 자기 실행 예를 요구한다. 수정 안내 예: “텍스트는 ___를 바꾸어 2줄을 3줄로 고쳤다. AI에는 ___라는 조건을 더했고, 나는 ___를 확인했다.” `range`는 “정한 횟수만큼 되풀이하는 부분”으로 먼저 설명한다. 추가: 현재 없는 짝 활동으로 한 친구는 예상 줄 수, 다른 친구는 실제 줄 수를 읽고 차이를 말한다(체험 시간 안 2분). 빠른 학생은 텍스트·블록의 반복 횟수를 2로 바꾸어 결과를 비교한다. AI에게 두 줄을 요청하는 문장은 종이·구두로 새로 작성하는 선택 과제로 제안하며, 현재 AI 시뮬레이션의 두 선택지는 1줄/3줄이므로 이 새 요청을 화면에서 실행할 수는 없다. 이를 바탕으로 ‘구체적인 요청도 실제 AI는 확인이 필요’라는 이유를 설명한다. 3줄 성공 후 일부러 잘못 바꾼 현재 상태를 보고 성공 표시가 무엇을 뜻하는지도 교사가 짚는다. 외부 AI 활동을 추가하지 않고 시뮬레이션 한계를 설명한다.

**40분 운영안(제안).** 접속·목표 3 + 초기 생각 3 + 세 방법 예측·실행·짝 확인 9 + 분류 5 + 비교문 작성 8 + 퀴즈·성찰 7 + 정리·저장·전환 3 + 여유 2 = **40분**. 문장 틀·용어 카드·두 줄→세 줄 수정 시범을 제공하고 지원 학생은 먼저 말로 설명한 뒤 자기 문장으로 입력한다. 시간 부족 시 선택 게시·추가 횟수 실험을 생략한다. 비교문·퀴즈 등 현재 필수는 생략 완료하지 않는다. 접속 실패는 준비된 코드/블록/요청 카드와 종이 결과 비교로 대체하고 기록 저장은 연결 회복 후 한다. 실제 AI 호출이 없어 외부 생성 지연은 없다.

**수정 영향.** 안내·짝 설명은 기존 키·완료·3점 유지 가능. 분류 수 축소는 카드와 복원 배열 길이·완료 계산에 영향. `runs`를 현재 입력 변경 때 초기화한다면 과거 성공 이력을 인정할지 정하고 완료 해제·재실행 안내·복원 호환성을 함께 검토해야 한다. 비교 문장 요구 변화는 기존 입력을 계속 읽되 새 완료 조건을 소급할지 결정해야 한다. 이번에는 구현하지 않는다.

## 3차시 — AI는 무엇을 잘하고 못할까?

**현재 구성·확인 사실.** 목표는 AI 강점·한계 이해와 결과 확인·안전 사용이다([web/app/page.tsx:33](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/page.tsx:33>), [web/app/lesson/3/page.tsx:250](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/page.tsx:250>)). 선수 지식은 2차시 사람이 목표·결과를 확인한다는 원리, 개인정보·공식 자료의 뜻. 실제 5단계는 ①AI 답이 언제나 맞는지 초기 선택 ②분류·요약·아이디어 3사례 ③최신 정보·감정·모호한 부탁·그럴듯한 오류 4사례 ④사실 확인·개인정보 3사례 ⑤퀴즈 3개와 확인 행동 성찰이다([web/lib/lesson-three.ts:1](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:1>), [web/lib/lesson-three.ts:3](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:3>), [web/lib/lesson-three.ts:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:9>), [web/lib/lesson-three.ts:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:16>), [web/app/lesson/3/content.tsx:12](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:12>); 짧은 경로는 `web/app/lesson/` 기준). 실제 AI 응답을 생성하거나 출처를 열어 비교하는 활동은 없다.

**필수·결과물·완료.** 사례 3+4+3개 모두 정답 선택·채점, 퀴즈 채점·3/3, 성찰 10자 이상 후 완료 저장. 초기 선택·성찰 게시는 완료 비필수([web/lib/lesson-three.ts:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:55>), [web/app/lesson/3/page.tsx:275](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/page.tsx:275>), [web/app/lesson/3/page.tsx:282](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/page.tsx:282>)). `activity_data`: `opening/strengthChoices/strengthChecked/limitationChoices/limitationChecked/verificationChoices/verificationChecked/answers/quizChecked`; 성찰 별도(1000자 제한), 퀴즈 점수 0~3은 채점 뒤 저장한다([web/lib/lesson-three.ts:28](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:28>), [web/app/lesson/3/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:16>), [web/app/lesson/3/page.tsx:47](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/page.tsx:47>)).

| 기준 | 판정·강점 | 문제점·예상 어려움(추정) |
|---|---|---|
| 교육적 효과 | 우선 개선 — 도움·한계·개인정보·출처 확인을 퀴즈와 성찰로 연결하고 이유 피드백을 준다([web/lib/lesson-three.ts:4](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:4>), [web/lib/lesson-three.ts:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:10>), [web/lib/lesson-three.ts:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:18>), [web/app/lesson/3/content.tsx:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:9>)). | 강점 3개는 모두 첫 선택, 한계 4개는 모두 두 번째여서 단계 제목만 보고 풀 수 있다. 출처 비교·오류 수정 행동은 직접 수행하지 않는다. ‘유명인 생일’을 ‘학교 공식 홈페이지’에서 확인한다는 사례는 그 정보의 적합한 출처인지 불분명하다([web/lib/lesson-three.ts:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:17>)). |
| 6학년 수준 | 우선 개선 — 급식·친구 감정·전화번호 사례는 생활과 가깝다([web/lib/lesson-three.ts:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:10>), [web/lib/lesson-three.ts:11](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:11>), [web/lib/lesson-three.ts:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-three.ts:18>)). | 안전 단계에도 공통 선택지 ‘AI가 도움을 줄 수 있어요 / AI만으로 판단하기 어려워요’를 사용한다([web/app/lesson/3/content.tsx:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:9>), [web/app/lesson/3/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:15>)). 개인정보를 넣는 행동의 안전성을 묻는데 AI 능력으로 답해야 하므로 질문·선택지 기준이 어긋난다. ‘패턴·맥락·근거’는 예가 필요하다. |
| 40분 분량 | 보완 필요 — 입력은 성찰 한 문장으로 적다. | 일반 24~33분이라 판단 실천을 넣지 않으면 활동 분량 부족 예상. 지원·재시도는 37~49분이어서 남는 시간은 학급 내 동일하지 않다. |
| 재미·흥미 | 우선 개선 — 틀려도 이유를 읽고 다시 선택할 수 있다([web/app/lesson/3/content.tsx:13](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:13>), [web/app/lesson/3/content.tsx:14](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/3/content.tsx:14>)). | 10개 사례+3퀴즈가 모두 라디오와 채점으로 이어져 방식 반복이 크다. 실제 증거를 찾고 친구와 판단을 설명하는 도전·선택권이 작다. 흥미 저하는 추정이며 관찰 결과가 아니다. |

**현재 활동 시간 추정(분).** 실측·수업 관찰 없음. 읽기·선택뿐 아니라 이유 이해·성찰 구상 포함. 지원 열에 용어 설명·오답 재시도를 포함한다.

| 활동 | 완료 필수 여부 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 접속·목표 안내 | 운영 필수 | 2~3 | 3~4 | 4~6 | 로드·확인 목표 |
| ①초기 생각 | 완료 비필수 | 1~2 | 2~3 | 3~4 | 3선택·이유 |
| ②강점 3사례 | 필수 | 2~3 | 3~4 | 5~6 | 읽기·분류·피드백 |
| ③한계 4사례 | 필수 | 3~4 | 4~6 | 6~8 | 상황·용어 해석·수정 |
| ④안전 3사례 | 필수 | 2~3 | 3~4 | 5~7 | 기준 이해·출처·개인정보 |
| ⑤퀴즈·성찰 | 필수 | 4~6 | 6~8 | 9~12 | 3문항·확인 행동 작성 |
| 정리·저장·전환 | 운영 필수 | 2~3 | 3~4 | 5~6 | 단계 이동 합산·저장·여유 |
| **전체 합계** | 전체 수업 흐름 | **16~24** | **24~33** | **37~49** | 일반 부족, 지원은 초과 가능 |

초기 생각 제외 완료 필수+운영은 빠름 15~22 / 일반 22~30 / 지원 34~45분. 선택 게시·자유 사례는 별도 2~4분이며 합계에 미포함.

**개선 제안(미구현).** 유지: AI를 도움으로 쓰되 사람 판단·개인정보 보호를 강조하는 원리와 이유 피드백. 축소: 강점/한계 모두 같은 답 반복을 줄이거나 두 범주를 섞어 분류하고 반드시 한 사례의 이유를 말하게 한다(현재 7~10→6~8분 예상). 수정: 안전 선택지를 “안전한 확인 방법이에요 / 개인정보나 틀린 정보 위험이 있어요”로 바꾸고 질문을 “이 행동은 안전한가요?”로 명확히 한다. 출처 사례는 “AI가 알려 준 내일 급식을 학교의 이번 주 급식표와 날짜까지 비교하기”로 맞춘다. 안내 예: “패턴은 여러 예에서 되풀이되는 특징이에요. 자신 있는 말보다 출처의 날짜와 내용이 맞는지 살펴봐요.” 추가: 현재 없는 **교사가 준비한 가상 AI 답과 같은 날짜의 급식표 비교**(8~10분). 실제 학생 자료 없이 틀린 메뉴 한 가지를 찾고 ‘답/근거/고칠 내용’을 적게 하여 확인 행동을 결과물로 남긴다. 빠른 학생은 믿을 만해 보이지만 날짜가 다른 자료를 판별한다. 전체 일반 24~33→34~43분으로 배움을 늘리는 제안이며 단순 분량 채우기가 아니다.

**40분 운영안(제안).** 접속·목표 3 + 초기 생각 2 + 강점 4 + 한계 5 + 안전 사례·선택지 기준 설명 6 + 가상 답·급식표 짝 비교 10 + 퀴즈·성찰 6 + 정리·저장·전환 2 + 여유 2 = **40분**. 지원 학생에게 용어·출처 날짜 표시 카드와 ‘AI는 ___라고 했지만 ___에는 ___이므로 ___로 고친다’ 문장 틀을 준다. 현재 UI를 쓰는 동안 안전 단계의 선택지 의미를 교사가 설명하고 혼동을 기록한다. 부족 시 추가 비교를 5분으로 줄여 필수 채점·성찰에 배분한다. 외부 AI를 호출하지 않는 준비 자료 방식이므로 외부 실패에 독립적이며, 사이트 접속/저장 실패는 같은 종이 사례로 진행하고 온라인 완료는 이후 처리한다.

**수정 영향.** 교사 준비 비교·용어 지원은 현 키·완료·3점 유지 가능. 안전 선택지·문구만 바꾸면 수/정답 인덱스를 유지할 수 있으나 의미가 달라진 기존 저장 답의 해석을 검토해야 한다. 강점/한계 통합·혼합은 배열 순서·정답·복원·완료에 영향이 있으므로 기존 답을 단순 새 문항에 대응시키지 않는다. 검증 결과물을 새 필수 저장 항목으로 삼으면 기본값·기존 완료 인정·완료 해제를 함께 설계해야 한다. 이번에는 구현하지 않는다.



## 4차시 — AI에게 잘 지시하는 방법

**현재 구성과 근거.** 목표는 목표·상황·조건·결과 형식을 담아 안전하게 요청하고 결과를 보며 다시 요청하기다([web/app/lesson/4/page.tsx:249](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/page.tsx:249>)). 선수 지식은 AI 결과를 사람이 확인한다는 이해와 라디오·체크박스·문장 입력이다. 실제 5단계는 요청 2개 비교 → 단서 4개 분류 → 조건 2개 이상 선택·결과 확인 → 수정 요청 3개 고르기 → 퀴즈 3개·나만의 지시·성찰이다([web/app/lesson/4/content.tsx:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:10>), [web/app/lesson/4/content.tsx:11](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:11>), [web/app/lesson/4/content.tsx:12](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:12>), [web/app/lesson/4/content.tsx:13](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:13>), [web/app/lesson/4/content.tsx:14](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:14>)). 도입 선택은 완료 필수가 아니다. 완료는 단서 4개·수정 사례 3개·퀴즈 3개 모두 정답 확인, 조건 2개 이상 및 결과 확인, 지시 20자·성찰 10자 이상이다([web/lib/lesson-four.ts:57](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-four.ts:57>)). 결과물은 선택 기록과 두 문장으로, 실제 AI 결과는 생성하지 않는다. 점수는 확인한 퀴즈 정답 수 0~3이고 전체 `activities`가 저장된다([web/app/lesson/4/page.tsx:47](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/page.tsx:47>)). 게시판 전송은 선택이다([web/app/lesson/4/page.tsx:274](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/page.tsx:274>)).

**현재 `activity_data` 전체 키:** `opening`, `clueChoices`, `cluesChecked`, `detailChoices`, `detailResultChecked`, `revisionChoices`, `revisionsChecked`, `answers`, `quizChecked`, `ownPrompt`([web/lib/lesson-four.ts:28](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-four.ts:28>)). `reflection`은 별도 진도 필드다.

**네 기준 판정.** 교육적 효과 **우선 개선**: 네 단서와 구체적 수정 요청이 다음 앱 요청의 틀을 제공한다. 그러나 도입에서 덜 구체적인 요청을 골라도 “맞아요”라 하여 잘못된 판단을 강화한다([web/app/lesson/4/content.tsx:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:10>)). “쉬는 시간 놀이”를 묻고 “우리 동네의 안전한 장소”를 조건으로 제시하며, 선택과 무관한 같은 문장을 “결과 비교”로 보여 준다([web/app/lesson/4/content.tsx:12](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:12>), [web/lib/lesson-four.ts:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-four.ts:10>)). 실제 두 결과·수정 전후 비교가 없어 결과 검토 능력을 확인하지 못한다. 6학년 수준 **보완 필요**: 짧은 일상 사례와 적은 타이핑은 적절하다. ‘상황/조건/형식’은 추상어이고 단서 오답은 정답 이름만 말한다([web/app/lesson/4/content.tsx:11](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/4/content.tsx:11>)); 뜻을 예시에 적용할 지원이 필요하다. 40분 분량 **보완 필요**: 일반 내부 진행 28~38분으로 부족할 가능성, 지원 진행 40~55분으로 초과 가능성이 있다. 재미·흥미 **우선 개선**: 축제·놀이와 자기 요청은 생활 관련성이 있다. 선택이 결과를 바꾸지 않고 정답 찾기가 대부분이라 탐색·성공 경험은 제한적이다. 이러한 학생 반응·효과는 추정이며 학생 실측이나 수업 관찰 결과가 아니다.

**현재 활동별 시간 추정(분).** 기기·로그인 준비를 갖춘 6학년 학급, 교사 안내 포함 가정. 각 범위는 읽기·판단, 선택/작성, 확인·오답 수정에 필요한 시간을 포함한다. 외부 AI는 현재 활동에 없으므로 별도 제작 시간 0분이며, 실행 성능은 관찰하지 않았다.

| 활동 | 필수/선택 | 빠름 | 일반 | 지원·재시도 | 근거 |
|---|---|---:|---:|---:|---|
| 도입 요청 비교 | 선택 | 2~3 | 3~4 | 4~6 | 두 문장 읽기·선택·설명 |
| 네 단서 분류 | 필수 | 3~4 | 4~6 | 6~8 | 4개 개념·재선택 |
| 조건 고르기·고정 결과 읽기 | 필수 | 2~3 | 3~4 | 4~6 | 2개 이상 선택·예시 이해 |
| 수정 요청 사례 | 필수 | 3~4 | 4~6 | 6~8 | 3상황·피드백·정답 수정 |
| 퀴즈 | 필수 | 3~4 | 4~5 | 6~8 | 3문항 읽기·재시도 |
| 나만의 지시·성찰 | 필수 | 4~6 | 6~8 | 9~12 | 내용 구상·타이핑·검토 |
| 안내·전환·정리·저장 | 운영 필수 | 2~3 | 4~5 | 5~7 | 단계 이동·완료 확인 |
| **합계** | 도입 선택 포함 | **19~27** | **28~38** | **40~55** | 일반 부족 가능/지원 초과 |

**구체적 개선안(제안, 현재 미구현).** 유지: 네 단서, 개인정보 없는 요청, 부족한 점을 말하는 수정 사례. 축소: 교사가 2개를 시범 보이고 학생이 2개를 재분류해 설명을 4~6→3~4분으로 줄인다. 다만 현재 완료 조건은 4개 전부 정답이므로 학생은 시범 문항을 포함한 4개 모두 답을 선택하고 확인해야 한다. 수정: 도입 오답에 “첫 요청은 ‘멋지게’의 뜻이 불분명해요. 대상·개수·결과 모양이 적힌 요청을 다시 골라 보세요.”를 표시한다. 놀이 문맥을 “교실에서 10분 안에, 준비물 없이, 3가지 놀이를 이유와 함께 표로”로 통일한다. 추가: 짝에게 서로 다른 두 예시 결과를 주고 “우리 조건을 지킨 부분에 밑줄, 빠진 조건 하나에 동그라미” 후 수정 요청 한 줄을 쓴다. 조건 활동 3~4→7~8분, 수정 사례 4~6→5~6분; 실제 비교 근거를 만든다. 지시에는 “6학년을 위한 __을 __개, __형식으로 제안해 줘” 틀과 두 단서 표시를 제공한다. 개선 후 일반 필수 흐름은 35~40분을 목표로 한다.

**40분 운영안(제안).** 도입·요청 비교 4 + 단서 예시·분류 6 + 놀이 두 결과 비교 8 + 수정 요청·짝 확인 6 + 퀴즈 5 + 나만의 지시·성찰 7 + 정리·완료 저장·여유 4 = **40분**. 빠른 학생은 같은 목표에서 대상/형식만 바꾼 요청을 추가해 예상 차이를 말한다(선택, 공통 시간 안). 지원 학생은 두 단서 문장 틀·읽기 짝·교사 한 사례를 사용하고 선택 심화를 생략한다. 시간이 부족하면 비교 사례를 한 쌍으로 제한하고 퀴즈·필수 글·저장 시간을 확보한다. 사이트/기기 실패 시 인쇄된 요청·결과 카드로 동일 비교와 문장 쓰기를 진행하며 저장 완료로 간주하지 않는다.

**수정 영향.** 문맥·피드백과 교실 운영만 바꾸면 현재 완료 6조건·3점·`activity_data` 키를 유지할 수 있다. 조건별 결과는 `detailChoices` 순서와 복원 길이를 보존해야 한다([web/lib/lesson-four.ts:49](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-four.ts:49>)). 두 단서 표시나 직접 수정문을 새 필수 기록으로 만들면 길이만 확인하던 `ownPrompt` 검증·완료/수정 후 해제·복원 기본값이 함께 바뀌므로 별도 설계가 필요하다. 현재 검토에서 소스·DB·학생 기록은 변경하지 않았다.

## 5차시 — Canva AI 코드 시작하기

**전제와 현재 구성.** 모든 학생이 Canva 계정을 보유하고 Canva AI 코드가 정상 작동한다는 사용자 확인을 운영 전제로 채택한다. 따라서 본 수업은 웹에서 계획·지시를 기록한 뒤 Canva로 이동해 실제 생성·시험·수정하고 웹으로 돌아오는 활동이다. 이전 검토의 ‘정적 웹 예시가 실제 제작 결과의 전부’라는 해석과 계정 준비 비용은 철회한다. 실제 학생 소요 시간·생성 대기·학습/흥미 반응은 측정하지 않았다.

목표는 안전한 제작 지시를 쓰고 앱 결과를 테스트·개선하기다([web/app/lesson/5/page.tsx:258](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/page.tsx:258>)). 선수 지식은 4차시의 목표·대상·조건·형식, 복사/붙여넣기와 탭 전환이다. 웹의 5단계는 도구 역할 선택 → 사용자·문제·기능 각 1개 계획 → 지시 30자 이상 → 결과 판단·테스트 3항목·수정 지시 15자 이상 → 퀴즈 3개·성찰 10자 이상이다([web/app/lesson/5/content.tsx:14](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:14>), [web/app/lesson/5/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:15>), [web/app/lesson/5/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:16>), [web/app/lesson/5/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:17>), [web/app/lesson/5/content.tsx:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:18>)). 실제 Canva 제작·시험·수정은 수업 수행에 포함하지만 웹 완료 함수가 외부 실행을 직접 검증하지는 않는다. 웹 필수는 역할 정답·계획 확인·안전 검사·결과 판단 정답·3항목 점검·수정문·퀴즈 전 정답·성찰이다([web/lib/lesson-five.ts:66](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:66>)). 점수는 퀴즈 0~3점이며 전체 활동을 저장한다([web/app/lesson/5/page.tsx:47](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/page.tsx:47>)). 게시판은 선택([web/app/lesson/5/page.tsx:283](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/page.tsx:283>)).

수업 결과물은 **Canva의 실제 앱과 제작/수정 지시, 첫 시험·재시험의 비교**다. 웹 기록은 그중 지시·체크·성찰을 보관한다. 앱 공유 링크는 기존 ‘나의 앱 보관함’에 5차시 작품으로 등록할 수 있다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)); 결과물 인계 통로가 없다는 진단은 철회한다. 이 공유 URL은 실행·발표 재사용 수단이며 원본 Canva 편집 프로젝트나 AI 대화의 재접근을 보장하지는 않는다. 다만 차시 본문이 그 이용 시점·다음 차시 재사용을 안내하지 않는다([web/app/lesson/5/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:16>), [web/app/lesson/5/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:17>), [web/app/lesson/5/content.tsx:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:18>)). 현재 `activity_data` 키는 `introChoice`, `introChecked`, `userChoice`, `problemChoice`, `featureChoice`, `planChecked`, `ownPrompt`, `promptChecked`, `resultChoice`, `testChoices`, `testChecked`, `revisionPrompt`, `answers`, `quizChecked`이며 성찰은 별도 필드다([web/lib/lesson-five.ts:21](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:21>)).

**네 기준 판정.** 교육적 효과 **보완 필요**: 사용자→문제→한 기능을 실제 앱으로 만들고 눌러 확인·수정하는 과정은 목표와 잘 연결된다. Canva 수행이 없다는 기존 우선 개선 근거는 제거한다. 다만 웹 계획은 사용자/문제/기능을 하나씩 고르면 확인되며 서로 맞는지, 지시에 고른 문제·기능이 포함되는지는 검증하지 않는다([web/lib/lesson-five.ts:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:69>), [web/lib/lesson-five.ts:70](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:70>), [web/app/lesson/5/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:15>), [web/app/lesson/5/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:16>)). Canva가 정상 작동해도 목표와 무관한 앱이 생성될 수 있으므로 계획→지시→실제 앱의 일치 확인은 유지할 문제다. 다른 문제는 본문이 “실제 Canva AI를 부르지 않아도 괜찮아요”, “다음 단계에서 준비된 결과”로 안내해 본 수업과 예비 경로를 구별하지 않고, 작성 지시를 어디에 붙이고 어떤 실제 결과로 체크할지 설명하지 않는 점이다([web/app/lesson/5/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:16>), [web/app/lesson/5/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:17>)). 6학년 수준 **보완 필요**: 한 기능·친숙한 놀이 예시와 한국어 지시는 적절하나 탭 왕복, 두 지시와 두 생성 결과의 관리가 부담일 수 있다. 안전 검사는 금칙어/전화형식에 의존해 “비밀번호를 입력받지 않게”도 거절할 수 있다([web/lib/lesson-five.ts:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:61>)); 교사의 내용 확인이 필요하다. 40분 분량 **우선 개선**: 실제 생성·수정·재시험을 포함한 일반 36~52분으로 초과 위험이 있다. 계정 준비가 아니라 실제 만들기와 중복 설명을 조절해야 한다. 재미·흥미 **적절(설계상)**: 자기 계획이 화면으로 나타나고 버튼 결과를 확인·고치는 선택과 즉각적 피드백이 있다. 실제 흥미 상승은 관찰 전이며, 웹 예시를 다시 풀게 하면 몰입을 끊을 수 있다.

**활동별 예상 시간(분, 실측 아님).** 계정 발급·권한 확인·로그인 준비는 기본 시간에 넣지 않는다. 준비된 Canva 세션을 전제로 읽기·구상, 조작/타이핑, 결과 확인/수정·대기를 포함한다. 현재 웹 과제를 모두 수행하되 정적 예시의 별도 테스트는 실제 Canva 시험으로 대체한 통합 경로다.

| 활동 | 수행 위치·구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 역할 확인·사용자/문제/기능 계획 | 웹 필수 | 4~6 | 6~8 | 8~12 | 읽기·3선택·계획 일치 설명 |
| 제작 지시 작성·안전 확인 | 웹 필수 | 3~5 | 5~7 | 8~11 | 30자 이상·내용 점검·수정 |
| Canva 이동·붙여넣기·첫 생성 | 실제 제작 필수 | 3~5 | 5~8 | 8~12 | 탭/기기 전환·조작·생성 대기 |
| 실제 앱 3항목 시험 | Canva 필수 | 3~4 | 4~6 | 6~9 | 버튼·글자·개인정보 요구 점검 |
| 수정 지시→Canva 전달·대기·재시험 | 웹/Canva 필수 | 4~6 | 6~9 | 9~14 | 15자 이상·1개 수정·전후 비교 |
| 웹 복귀·판단/체크/계획 확인 | 웹 필수 | 1~2 | 2~3 | 3~5 | 외부 관찰을 웹 기록에 연결 |
| 퀴즈·성찰 | 웹 필수 | 4~5 | 5~7 | 7~10 | 3문항·10자 성찰·오답 수정 |
| 공통 안내·정리·완료 저장 | 운영 필수 | 2~3 | 3~4 | 4~6 | Canva 전환은 위 행에 포함 |
| **필수 합계** | 실제 Canva 포함 | **24~36** | **36~52** | **53~79** | 일반 초과 위험/지원 초과 |
| 작품 링크 보관·추가 비교 | 선택 | 1~2 | 2~3 | 3~5 | 보관함 등록·대상 표현 비교 |

세션이 만료되거나 기기를 바꿔야 할 때만 복구·전환 지연이 추가될 수 있다(가정 2~5분, 기본 합계 제외). 생성 속도 범위는 추정이며 정상 작동 확인을 생성 시간 측정으로 바꾸어 해석하지 않는다.

**유지·축소·수정·추가(모두 제안).** 유지: 한 문제·한 기능, 안전 지시, 실제 앱의 3항목 점검. 축소: 웹 고정 예시를 또 시험하는 절차·역할/퀴즈의 반복 구두 설명을 빼고 모든 필수 선택·확인은 유지한다. 수정: “웹에 쓴 제작 지시를 복사해 Canva AI 코드에 붙여넣으세요. 생성된 **내 앱**에서 버튼·글자·개인정보 요구를 확인하세요. 웹으로 돌아와 수정 지시를 쓰고 Canva에 전달한 뒤 다시 시험하세요. 아래 준비된 화면은 설명·오류 시 예시예요.”로 이동 순서를 명시한다. 추가: 고른 문제·핵심 기능에 밑줄을 긋고 제작 지시에 같은 조건을 표시한 뒤 실제 Canva 앱을 눌러 그 조건을 해결하는지 확인한다. “처음 시험에서 __ / 수정 뒤 __ / 아직 안 된 점 __”을 성찰이나 교사 관찰표에 남긴다. “일부 표현만 자동 검사하므로 개인정보가 없는지 사람이 확인해요”를 안내하며 오류를 단어 피하기로 해결하지 않는다. 교사의 내용 확인만으로 자동 완료 조건이 풀리지는 않는다. 올바른 안전 금지 문장이 거절되면 검사 한계로 웹 미완료 기록을 보존하고 후속 검사 수정 대상으로 남긴다. 현재 일반 36~52분에서 한 주제·한 수정·왕복 순서 고정으로 36~40분 목표; 생성이 늦으면 40분 내 수정 성공까지 보장할 수 없음을 남긴다.

**정확히 40분 운영안(제안).** 역할·도입 3 + 사용자/문제/기능 계획 4 + 제작 지시·안전 확인 5 + Canva 이동·붙여넣기·첫 생성 6 + 실제 앱 3항목 시험 4 + 수정문·Canva 전달·대기·재시험 8 + 웹 복귀·판단/3체크 확인 2 + 퀴즈·성찰 5 + 정리·완료 저장·여유 3 = **40분**. 빠른 학생은 시험 시간 안에 다른 대상의 글자/안내 비교, 끝난 뒤 보관함 링크 등록을 선택한다. 지원 학생은 놀이 주제와 빈칸 틀·읽기 짝, 한 수정만 사용하되 웹 필수 선택·3점검·퀴즈는 모두 확인한다. 생성/수정 지연은 마지막 3분 중 여유 1분 안에서만 흡수한다. 수정·재시험은 수업 30분 시점에 마무리하거나 미반영 상태를 기록해 다음 시간으로 인계하고 웹 필수 입력·저장에 복귀한다. 40분은 수업 종료선이며 모든 학생의 실제 수정 성공이나 웹 완료를 보장하지 않는다. 서비스가 일시 실패하면 이미 생성된 자기 작품을 재사용한다. 작품도 없으면 준비 예시로 시험 계획을 쓸 수 있지만 실제 앱 제작/직접 시험을 한 것처럼 기록하지 않는다.

**완료 의미·수정 영향.** 현재 3체크는 ‘정상 작동 성공’이 아니라 점검 수행이며 실패를 직접 확인하고 수정문을 작성한 경우도 다른 조건과 함께 웹 완료가 가능하다([web/lib/lesson-five.ts:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:9>), [web/lib/lesson-five.ts:66](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:66>)). 실제 Canva 앱을 시험한 체크를 교사 안내로 기존 칸에 기록할 수 있으나 본문은 ‘준비된 화면’이라 지시 정합성 보완이 필요하다. 웹 완료는 외부 생성·수정 반영·재시험·작품 링크 존재의 증명이 아니다. 이동/복귀 안내와 교실 관찰표만 보완하면 6조건·3점·기존 키를 유지할 수 있다. 실제 앱 링크나 전후 관찰을 새 필수로 저장하면 완료·수정 후 해제·복원 기본값([web/lib/lesson-five.ts:46](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-five.ts:46>))과 과거 완료 이력의 해석을 함께 설계해야 한다. 소스·DB·학생 기록·배포는 변경하지 않았다.
## 6차시 — 한 기능 앱 만들기

**현재 구성과 실제 수행.** 학생 Canva 계정·AI 코드 정상 작동은 사용자 확인된 전제다. 웹의 정적 놀이 화면은 설명·예비 경로이며 본 수업의 제작 앱은 Canva에서 실제 생성·수정·시험한 작품이다. 웹 버튼의 이벤트 유무로 학생 Canva 앱의 작동·흥미를 판단했던 기존 근거는 철회한다. 목표는 입력·동작·결과를 정해 한 기능을 안전하게 만들고 테스트하기다([web/app/lesson/6/page.tsx:257](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/page.tsx:257>)). 선수 지식은 5차시의 제작/수정 지시, 탭 전환·붙여넣기와 실행 화면 사용이다.

웹의 5단계는 한 기능 의미 선택 → 입력/동작/결과 3선택 → 지시 35자 이상 → 결과 판단·3점검·수정 지시 15자 이상 → 퀴즈 3개·성찰 10자 이상이다([web/app/lesson/6/content.tsx:14](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:14>), [web/app/lesson/6/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:15>), [web/app/lesson/6/content.tsx:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:16>), [web/app/lesson/6/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:17>), [web/app/lesson/6/content.tsx:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:18>)). 웹 완료는 개념 정답 확인, 흐름 모두 정답 확인, 안전 지시 확인, 결과 판단 정답·3체크·수정문, 퀴즈 전 정답·성찰이다([web/lib/lesson-six.ts:66](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:66>)). 퀴즈 0~3점과 전체 활동을 저장하며 게시판은 선택([web/app/lesson/6/page.tsx:47](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/page.tsx:47>), [web/app/lesson/6/page.tsx:282](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/page.tsx:282>)). 수업 결과물은 **실제 한 기능 Canva 앱, 입력→처리→결과 설명, 시험·수정 전후 기록**이다. 기존 앱 보관함은 5~10차시 공유 링크와 새 탭 열기를 지원하여 작품을 다음 시간에 다시 실행·발표할 수 있다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)). 공유 URL만으로 원본 Canva 편집 프로젝트/AI 대화에 다시 접근할 수 있다고 보장할 수는 없다. 다만 이 차시 본문은 이전 작품 여는 시점·작품 버전/재사용을 안내하지 않는다.

현재 `activity_data` 전체 키는 `conceptChoice`, `conceptChecked`, `inputChoice`, `actionChoice`, `outputChoice`, `flowChecked`, `ownPrompt`, `promptChecked`, `resultChoice`, `testChoices`, `testChecked`, `revisionPrompt`, `answers`, `quizChecked`이고 성찰은 별도 필드다([web/lib/lesson-six.ts:21](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:21>)). 링크와 실제 결과·재시험 성공은 이 완료 함수의 필수 검증 항목이 아니다.

**네 기준 판정.** 교육적 효과 **보완 필요**: 작은 기능을 생성하고 입력→결과를 실제 눌러 확인하며 고치는 활동은 코딩의 흐름·디버깅에 직접 연결된다. 실제 실행이 없다는 기존 판단은 철회한다. 남은 문제는 ‘동작’ 정답 “고른 놀이에 맞는 준비물을 보여 주기”가 출력과 겹치고, 다른 보기가 개인정보/광고라 처리 이해를 충분히 확인하지 못하는 점이다([web/lib/lesson-six.ts:3](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:3>)). 또한 “실제 Canva AI를 부르지 않아도 괜찮아요”, “직접 써 본다고 생각” 안내가 실제 Canva 수행·복귀 체크와 일치하지 않는다([web/app/lesson/6/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:17>)). 6학년 수준 **보완 필요**: 한 버튼·한국어 지시와 큰 글씨 결과는 적절하다. 입력은 타이핑뿐 아니라 클릭이라는 예시, 처리/표시 구분과 탭 왕복 순서 지원이 필요하다. 안전 금칙어 검사는 내용의 개인정보 여부를 완전 검증하지 못하며 안전 금지 문장도 막을 수 있다([web/lib/lesson-six.ts:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:61>)). 40분 분량 **우선 개선**: 새 작품 생성·수정·재시험 포함 일반 37~54분으로 초과 위험; 계정 준비 비용은 없다. 재미·흥미 **보완 필요**: 실제 눌러 바뀌는 자기 앱과 수정 성공은 도전·피드백 기회다. 다만 5차시와 같은 놀이 예시·지시·체크를 다시 수행할 때 무엇이 새 학습인지 설명이 약하다. 학생의 실제 흥미는 아직 관찰하지 않았다.

**활동별 시간 추정(분).** 계정 발급·권한 확인·로그인 준비 제외, 준비된 Canva 세션 사용 가정. 웹 정적 예시를 별도 실행하지 않고 실제 Canva 시험으로 대체한 필수 흐름이며 읽기/판단, 입력/조작, 대기/재시험을 포함한다.

| 활동 | 수행 위치·구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 한 기능 의미·입력/동작/결과 선택 | 웹 필수 | 4~6 | 6~8 | 8~11 | 3역할 구분·정답 수정 |
| 제작 지시·안전 확인 | 웹 필수 | 3~5 | 5~8 | 8~12 | 35자 이상·한 기능 조건 정리 |
| Canva 이동·붙여넣기·첫 생성 | 실제 제작 필수 | 3~5 | 5~8 | 8~12 | 전환·첫 결과 대기 |
| 한 기능 3항목 시험 | Canva 필수 | 3~5 | 5~7 | 7~10 | 놀이/준비물·이해·안전 확인 |
| 수정문→Canva 전달·대기·재시험 | 웹/Canva 필수 | 4~6 | 6~9 | 9~14 | 15자 수정·반영 전후 비교 |
| 웹 복귀·판단/3체크 확인 | 웹 필수 | 1~2 | 2~3 | 3~5 | 실제 관찰을 체크로 기록 |
| 퀴즈·성찰 | 웹 필수 | 4~5 | 5~7 | 7~10 | 3문항·10자 이상·재선택 |
| 공통 안내·정리·완료 저장 | 운영 필수 | 2~3 | 3~4 | 4~6 | 외부 전환은 위 행 포함 |
| **필수 합계** | 새 작품 생성 경로 | **24~37** | **37~54** | **54~80** | 일반 초과 위험/지원 초과 |
| 다른 한 기능 설계·링크 보관 | 선택 | 1~2 | 2~3 | 3~5 | 추가 앱 생성은 요구하지 않음 |

세션 복구·기기 교체가 실제 필요할 때만 2~5분이 추가될 수 있다(가정, 기본 합계 제외). 서비스 정상 작동은 사용자 확인이며 생성/수정 대기나 학생 소요 시간을 실측했다는 뜻이 아니다.

**유지·축소·수정·추가(제안).** 유지: 한 기능 제한, 실제 버튼·놀이/준비물·안전 확인과 수정 지시. 축소: 웹의 기존 필수 선택은 모두 유지하되 같은 안전 사례의 반복 설명·예시 재시험을 줄인다. 수정: “입력=추천 버튼 누르기 / 처리=목록에서 놀이 하나 고르기 / 결과=놀이와 준비물을 표시하기”로 구분하고 “웹 지시→Canva 생성→직접 시험→웹 수정문→Canva 수정→재시험→웹 체크”를 단계마다 보여 준다. 추가: 첫 시험 전에 예상 결과를 말하고 실제 결과와 비교한 1건을 성찰에 남긴다. 이전 작품의 실행 공유 URL은 보관함에서 열어 시험하고, 수정은 Canva의 원본 프로젝트/AI 대화에서 한 기능만 다듬는 운영을 권한다. 수정 재사용은 동일 학생의 원본 Canva 프로젝트/AI 대화가 유지되고 재접근할 수 있다는 운영 가정이며, 공유 URL만 확보된 경우에는 적용하지 않는다. ‘처음부터 새 작품’ 경로 일반 37~54분 대비 재사용 시 첫 생성/이동 5~8→3~5분, 개념/흐름 6~8→5~6분·지시 5~8→4~6분·시험 5~7→4~6분으로 **32~46분**까지 줄이는 추정이다. 아래 40분안은 이 재사용 운영을 적용하며 긴 재생성까지 보장하지 않는다. 안전 확인 실패는 교사가 내용으로 점검하고 금칙어 우회 과제로 만들지 않는다. 교사 확인이 자동 완료 조건을 풀지는 않으므로 올바른 안전 금지 문장의 자동 거절은 웹 미완료로 보존하고 후속 검사 수정 대상으로 남긴다.

**40분 운영안(원본 Canva 수정 재사용 제안).** 동일 학생의 원본 Canva 프로젝트/AI 대화가 유지되고 재접근 가능하다는 운영 가정이다. 앱 보관함의 실행 URL만으로 이 조건을 충족했다고 보지 않는다. 도입·한 기능 3 + 입력/처리/결과 선택·설명 5 + 제작 지시·안전 확인 5 + Canva로 이동·원본 프로젝트/AI 대화 열기·지시 붙여넣기·생성/적용 대기 5 + 실제 3항목 시험 5 + 수정 전달·대기·재시험 7 + 웹 복귀·판단/3체크 확인 2 + 퀴즈·성찰 5 + 정리·완료 저장·여유 3 = **40분**. 빠른 학생은 두 번 눌렀을 때 결과와 준비물의 짝이 맞는지 비교하고 새 한 기능은 흐름 3칸으로만 표현한다(선택). 지원 학생은 빈칸 틀·구두 설명·한 번의 시험을 쓰되 필수 3항목을 모두 직접 시험·확인한다. 이전 작품을 쓸 수 없으면 새 생성 경로이며 초과 가능성을 알리고 교사가 주제/한 기능을 고정해 지원한다. 지연은 마지막 3분 중 여유 1분으로만 흡수하고 30분 시점에 웹 복귀를 시작한다. 재시험이 끝나지 않으면 수정문·미반영 상태를 보존해 다음 시간에 잇는다. 40분은 운영 종료선이며 모든 지원 학생의 필수 활동 완료를 보장하지 않는다. 직접 점검하지 못한 항목은 체크하지 않고 기록을 저장한다. 일시 서비스 오류 때는 이미 생성한 자기 앱으로 시험하며, 작품 없이 그림/교사 시연만 본 경우 직접 시험했다고 체크하지 않는다.

**완료 의미·수정 영향.** 체크는 ‘함께 바뀌는지 점검했음’이며 정상 성공을 요구하지 않는다([web/lib/lesson-six.ts:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:10>)). 실패를 직접 확인한 실제 Canva 시험도 웹 조건을 충족할 수 있지만 웹 완료가 기능 성공·수정 반영·재시험을 증명하지 않는다([web/lib/lesson-six.ts:66](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:66>)). 웹 문구를 실제 Canva 결과로 연결하는 안내·성찰 틀·교사 관찰표는 6조건·3점·기존 키를 유지할 수 있다. 처리 개념의 보기 변경은 정답 인덱스·선택 개수/복원 범위를 보존 또는 변환해야 한다([web/lib/lesson-six.ts:46](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-six.ts:46>)). 앱 링크·관찰 전후를 새 필수 데이터로 만들면 완료·수정 해제·복원 기본값과 기존 완료 이력의 해석을 함께 설계한다. 이번 검토에서는 구현하지 않았다.
## 7차시 — 앱 기능 설계하기

**현재 구성과 수행 전제.** 모든 학생의 Canva 계정 보유·AI 코드 정상 작동은 사용자 확인된 전제다. 본 수업은 웹의 기능 설계를 Canva에 전달해 실제 기능과 화면 피드백을 구현·시험·수정하고 웹으로 돌아오는 수업이다. 정적 웹 예시를 학생의 실제 앱으로 간주했던 기존 근거는 철회한다. 목표는 사용자의 행동과 앱 결과를 연결해 안전한 기능을 설계하기다([web/app/lesson/7/page.tsx:256](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/page.tsx:256>)). 선수 지식은 6차시 입력→처리→결과, 제작/수정 지시, 탭 전환·붙여넣기다.

웹 5단계는 기능 설계 의미 선택 → 사용자 행동/앱 동작/화면 피드백 선택 → 기능 설명 35자 이상 → 결과 판단·3점검·수정 지시 15자 이상 → 퀴즈 3개·성찰 10자 이상이다([web/app/lesson/7/content.tsx:7](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:7>), [web/app/lesson/7/content.tsx:8](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:8>), [web/app/lesson/7/content.tsx:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:9>), [web/app/lesson/7/content.tsx:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:10>), [web/app/lesson/7/content.tsx:11](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:11>)). 웹 완료는 개념 정답 확인, 흐름 모두 정답 확인, 설명 안전 확인, 결과 판단 정답·3체크·수정문, 퀴즈 전 정답·성찰의 6묶음이다([web/lib/lesson-seven.ts:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:18>)). 퀴즈 0~3점과 전체 활동을 저장한다([web/app/lesson/7/page.tsx:45](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/page.tsx:45>), [web/app/lesson/7/page.tsx:54](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/page.tsx:54>)). 게시판은 선택([web/app/lesson/7/page.tsx:281](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/page.tsx:281>)). 수업 결과물은 **실제 Canva 기능/화면 피드백과 기능 설명·시험·수정 전후 기록**이다. 웹 완료 함수는 실제 작품 존재·수정 반영·재시험 성공을 직접 검증하지 않는다.

`activity_data` 전체 키는 `conceptChoice`, `conceptChecked`, `userAction`, `appAction`, `feedback`, `flowChecked`, `featurePlan`, `planChecked`, `resultChoice`, `testChoices`, `testChecked`, `revisionPrompt`, `answers`, `quizChecked`이고 성찰은 별도 필드다([web/lib/lesson-seven.ts:13](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:13>)). 기존 보관함은 공유 링크를 저장하고 새 탭으로 실행하는 작품 인계 수단이 있다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)). 실행/발표 URL은 원본 Canva 편집 프로젝트·AI 대화 재접근의 보장이 아니다. 아래 수정 재사용 경로는 **동일 학생의 원본 Canva 프로젝트/AI 대화 유지·재접근 가능**이라는 운영 가정이며 사용자에게 확인된 서비스 정상 작동과 구분한다. 원본이 없으면 새 생성 경로로 시간을 달리 잡는다.

**네 기준 판정.** 교육적 효과 **보완 필요**: 사용자 행동→앱의 도움→화면 피드백을 실제 앱에서 검사하면 설계와 사용성 판단이 연결된다. 6차시 ‘한 기능이 동작하는가’에서 7차시 ‘처음 보는 사람이 결과와 다음 행동을 이해하는가’로 발전할 수 있다([web/lib/lesson-seven.ts:7](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:7>)). 그러나 본문은 외부 AI 없이 “직접 써 본다고 생각”하는 예시만 안내하여 Canva 전달·실제 결과와 설계 비교·웹 복귀 순서가 불분명하다([web/app/lesson/7/content.tsx:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:9>), [web/app/lesson/7/content.tsx:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:10>)). 6학년 수준 **보완 필요**: 친숙한 놀이와 3칸 흐름은 접근하기 쉽다. ‘피드백’은 화면이 행동 뒤 무엇이 달라졌는지 알려주는 말/표시라고 풀어야 한다. 안전 검사는 35자·금칙어/전화형식에 한정되므로 설계 의미를 보증하지 않고 안전 금지 문장도 거절할 수 있다([web/lib/lesson-seven.ts:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:17>)). 40분 분량 **우선 개선**: 원본 재사용·수정 흐름도 일반 36~53분으로 초과 위험이며 지원 53~79분이다. 제작·시험을 40분 수업에서 제외해 분량 부족이라고 했던 기존 판단은 철회한다. 재미·흥미 **보완 필요**: 실제 자기 앱에 안내를 개선하고 처음 보는 사용자에게 시험받는 활동은 의미 있는 피드백 기회다. 현재 웹 선택지·퀴즈는 명백한 개인정보/광고 오답이 많고 정답이 첫 항목에 몰려 비교 도전이 낮다([web/lib/lesson-seven.ts:2](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:2>), [web/lib/lesson-seven.ts:8](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:8>)). 실제 흥미는 미관찰이다.

**활동별 시간 추정(분, 실측 아님).** 원본 Canva 프로젝트/AI 대화 재접근 가능을 가정한 통합 실제 수업이다. 정적 웹 예시를 따로 시험하지 않고 Canva 실제 시험으로 대체한다. 계정 발급·권한 확인·로그인 준비는 제외한다. 각 행은 읽기/설계, 조작/작성, 생성/수정 대기와 확인을 포함한다.

| 활동 | 수행 위치·구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 도입·기능 설계 개념 확인 | 웹 필수/운영 | 3~4 | 4~6 | 6~8 | 전 차시와 피드백 목표 구분 |
| 사용자/앱/화면 흐름 선택 | 웹 필수 | 2~3 | 3~4 | 4~6 | 3역할·정답 수정·관계 설명 |
| 기능 설명·안전 확인 | 웹 필수 | 3~5 | 5~7 | 7~10 | 35자 이상·피드백 조건 구상 |
| Canva 전환·원본 열기·지시 전달·생성/적용 | 실제 제작 필수 | 3~5 | 4~7 | 7~11 | 붙여넣기·실제 적용 대기 |
| 결과/이해/안전의 3항목 시험 | Canva 필수 | 3~4 | 4~6 | 6~9 | 버튼 결과·다음 행동·안전 점검 |
| 수정문→Canva 적용·대기·재시험 | 웹/Canva 필수 | 4~6 | 6~9 | 9~14 | 15자 수정·전후 비교 |
| 웹 복귀·판단/3체크 확인 | 웹 필수 | 1~2 | 2~3 | 3~5 | 실제 수행을 웹 기록에 연결 |
| 퀴즈·성찰 | 웹 필수 | 3~5 | 5~7 | 7~10 | 3문항·10자 이상·재선택 |
| 정리·완료 저장·여유 | 운영 필수 | 2~3 | 3~4 | 4~6 | 외부 전환은 위 행에 포함 |
| **필수 합계** | 원본 재사용 경로 | **24~37** | **36~53** | **53~79** | 일반 초과 위험/지원 초과 |
| 처음 보는 짝의 사용성 시험·링크 보관 | 선택 | 1~2 | 2~3 | 3~5 | 기본 3항목은 개인 시험 필수 |

원본에 재접근할 수 없어 새 생성이 필요한 경우 첫 Canva 행을 빠름 4~7/일반 7~12/지원 11~17분으로 대체하면 총 **25~39/39~58/57~85분**이다. 세션 복구·기기 교체가 실제 필요할 때만 별도 2~5분을 더할 수 있다(가정, 기본 합계 제외). 사용자 확인은 서비스 사용 가능·정상 작동에 관한 것이며 이 시간이나 개별 학생의 결과를 관찰한 것은 아니다.

**유지·축소·수정·추가(제안).** 유지: 3칸 흐름, 기능 설명과 실제 시험·구체적인 수정 지시. 축소: 같은 놀이의 고정 예시를 새로 다시 만들고 검토하는 절차·안전 오답의 반복 설명을 줄이고 현재 필수 선택/확인은 모두 수행한다. 수정: “6차시 원본 Canva 프로젝트를 열어 기능 설명을 붙여넣으세요. 버튼을 누른 뒤 **무엇이 바뀌었는지, 다음에 할 일이 보이는지**를 확인하세요. 웹에 수정 지시를 쓰고 Canva에 적용한 뒤 다시 확인하세요. 아래 화면은 설명·오류 시 예시예요.”로 연결한다. 피드백 과제는 “추천 완료: 놀이 이름·준비물을 보여주고 ‘다시 추천’의 뜻을 알려주기”처럼 한 조건만 개선한다. 추가: 처음 보는 사용자의 예상 결과와 실제 결과 차이를 성찰/교사 관찰표에 한 건 남긴다. 일반 필수 36~53분에서 원본 유지·한 피드백 수정·짧은 문장 틀로 기능 설명 5~7→4~6, 첫 적용 4~7→4~6, 시험 4~6→4~5, 수정/재시험 6~9→5~7분을 적용하면 **34~48분** 추정이다. 40분안은 종료 지점과 인계를 정한 운영안으로 긴 지원/대기를 해결했다고 주장하지 않는다. 안전한 금지 문장도 자동 검사에 거절될 수 있으며 교사 확인만으로 완료 조건이 풀리지는 않는다. 이런 경우 웹 미완료 기록을 보존하고 검사 수정의 후속 검토로 남기며 금칙어 우회를 학습시키지 않는다.

**정확히 40분 운영안(원본 재사용·한 피드백 개선 제안).** 도입 3 + 개념 확인 2 + 3칸 흐름 선택 4 + 기능 설명·안전 확인 5 + Canva 전환·원본 열기·붙여넣기·생성/적용 대기 5 + 실제 3항목 전체 시험 4 + 수정 지시·Canva 전달·대기·재시험 6 + 웹 복귀·판단/3체크 확인 2 + 퀴즈·성찰 5 + 정리·완료 저장·여유 4 = **40분**. 빠른 학생은 기본 시험 시간 안에 짝이 버튼/결과 뜻을 설명하게 하거나 다른 안내 문장과 비교한다. 지원 학생은 “사용자가 __하면 앱은 __하고 화면에는 __가 보여요” 틀·한 피드백 수정을 사용하되 필수 3항목을 모두 직접 시험·확인한다. 지연은 마지막 4분 중 여유 1분으로만 흡수하고 **29분 시점**에 Canva 수정/재시험을 종료 또는 미반영 상태로 인계하여 웹 복귀·필수 입력·저장을 보호한다. 지원 때문에 끝내지 못한 시험은 사실대로 미수행 상태로 남긴다. 원본이 없으면 새 생성이 필요하며 40분 내 전체 성공을 보장하지 않는다. AI 수정이 일시 실패해도 기존 실제 작품에서 3항목을 시험하고 미반영 수정문을 다음 시간에 잇는다. 작품 없이 웹 그림/교사 시연만 본 경우 직접 시험했다고 체크하지 않는다.

**완료 의미·수정 영향.** 현재 체크는 결과가 나타나는지·처음 보는 사람이 이해할지·개인정보 요구 여부를 **점검한 수행**이고 정상 성공을 요구하지 않는다([web/lib/lesson-seven.ts:7](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:7>)). 실제 Canva 시험에서 실패를 찾아 수정문을 작성한 경우도 다른 필수 조건과 함께 웹 완료가 가능하다([web/lib/lesson-seven.ts:18](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:18>)). 웹 완료와 실제 Canva 생성·수정 반영·재시험 성공을 구분해 기록한다. 웹↔Canva 안내·기존 성찰의 전후 비교 틀·교사 관찰표는 6완료 조건·3점·기존 키를 유지할 수 있다. 앱 링크/원본 프로젝트 식별/관찰을 새 필수 기록으로 만들면 완료 계산·수정 후 해제·복원 기본값과 기존 완료 이력의 해석을 설계해야 한다. 퀴즈/보기 순서 변경은 숫자 인덱스 답안의 복원 변환이 필요하다([web/lib/lesson-seven.ts:16](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:16>)). 검토만 수행했으며 소스·DB·학생 기록·배포는 변경하지 않았다.

## 8차시 — 두 기능 앱 만들기

### 현재 구성과 완료 근거

**운영 전제 정정:** 모든 학생이 Canva 계정을 보유하고 Canva AI 코드가 정상 작동한다는 사용자의 확인을 적용한다. 수업은 웹에서 설계·기록하고 Canva에서 생성·실행·수정한 뒤 웹으로 돌아오는 실제 제작 수업이다. 계정 발급·기능 권한 준비 시간을 포함하지 않는다. 사용자 확인은 도구를 사용할 수 있다는 근거이며, 학생별 앱의 성공·전체 체크 충족·수업 소요 시간의 관찰 결과는 아니다.

목표는 첫 기능의 결과를 다음 기능에 연결하고 여러 상황에서 직접 테스트하는 것이다([web/app/lesson/8/page.tsx:281](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/page.tsx:281>)). 선수 지식은 7차시의 행동→앱 동작→결과와 Canva에 제작 지시를 전달하는 경험이다. 기존 작품을 확장/수정하는 경로는 자신의 원본 Canva 프로젝트 또는 AI 코드 대화를 저장해 다시 열 수 있다는 운영 가정에 따른다. 공유 URL만 남아 있다는 사실로 편집 가능한 원본 접근까지 확인한 것으로 보지 않는다. 웹 5단계는 ① 연결 개념 ② 첫 기능·전달 값·두 번째 기능 선택 ③ 제작 지시 45자 이상 ④ 세 상황 체크·수정 지시 15자 이상 ⑤ 퀴즈 3문항·성찰 10자 이상이다([web/app/lesson/8/content.tsx:31](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:31>)). **실제 수업 결과물**은 Canva의 두 기능 앱과 시험·수정 전후이며, **웹에 저장되는 결과물**은 선택값·제작/수정 지시·자기보고 체크·성찰이다. 사이트가 Canva 앱을 자동 생성·시험한 것으로 처리하는 구조는 아니다([web/app/lesson/8/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/page.tsx:61>)).

필수 완료는 `conceptChoice=0/conceptChecked`, `firstFeature/sharedValue/secondFeature=0/connectionChecked`, 안전한 45자 지시와 `promptChecked`, `testChoices` 전부 참·수정 15자·`testChecked`, `answers` 전부 정답·`quizChecked`, 성찰 10자다([web/lib/lesson-eight.ts:118](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:118>)). `activity_data` 실제 키는 `conceptChoice`, `conceptChecked`, `firstFeature`, `sharedValue`, `secondFeature`, `connectionChecked`, `buildPrompt`, `promptChecked`, `testChoices`, `testChecked`, `revisionPrompt`, `answers`, `quizChecked`이며 성찰은 별도다([web/lib/lesson-eight.ts:42](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:42>)). 성찰 게시와 보관함 링크 등록은 선택이며 차시 완료 조건에 없다([web/app/lesson/8/page.tsx:306](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/page.tsx:306>)).

### 네 기준 평가

| 기준 | 판정 | 강점·문제·근거와 예상되는 어려움 |
|---|---|---|
| 교육적 효과 | 보완 필요 | 시간 선택→활동 추천을 Canva에서 실제 구현하면 값 전달·정상/미입력 시험을 연결할 수 있다. 다만 웹에는 “실제 외부 AI를 부르지 않고 준비된 결과를 시험”하라는 문구가 있어 실제 수업의 이동 시점·시험 대상이 불명확하다([web/app/lesson/8/content.tsx:63](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:63>)). 정적 버튼은 참고 그림의 한계이며 Canva 앱 실행 불가의 근거가 아니다. 또한 지시 예시는 “시간에 맞는 활동”만 지정하지만 체크는 5분 스트레칭·15분 준비물 있는 긴 활동·미선택 안내를 구체적으로 요구한다([web/app/lesson/8/content.tsx:54](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:54>), [web/lib/lesson-eight.ts:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:15>)). 생성 앱의 타당한 다른 추천을 실패로 오인할 수 있으므로 기대 결과를 지시에 먼저 맞춰야 한다. |
| 6학년 수준 | 보완 필요 | 쉬는 시간과 두 칸 그림은 익숙하다. “전달 값”을 다음 기능이 사용할 정보로 풀고 웹→Canva→웹을 교사가 한 번 시연하면 수행 부담을 낮출 수 있다. 안전 검사에는 길이·금지어만 있어 올바른 “전화번호를 받지 않게”도 거절한다([web/lib/lesson-eight.ts:111](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:111>)). 안전과 기능 연결의 의미 판단을 학생/교사가 별도로 해야 한다. “두 기능 앱은 따로 놓은 앱이 아니에요”는 모든 앱의 정의처럼 읽히므로 이번 과제의 조건으로 제한하는 편이 정확하다([web/app/lesson/8/content.tsx:32](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:32>)). |
| 40분 분량 | 보완 필요 | 통합 실습 일반 32~48분 추정으로 40분 경계다. 두 기능을 작게 한정하고 지시 틀·수정 1회·대기 중 예상 쓰기를 사용하면 40분 운영이 가능할 것으로 본다. 지원 진행은 53~74분이므로 전원 완료를 보장하는 분량은 아니다. |
| 재미·흥미도 | 적절 | 자신의 지시가 Canva 앱으로 나타나고 시간을 바꾸며 결과를 비교하는 과제는 생활 관련성과 즉각적인 확인 기회를 갖는다. 웹 정적 그림 때문에 재미가 없다고 판단하지 않는다. 다만 퀴즈 정답이 모두 첫 보기이고 위험한 개인정보 보기가 많아 패턴 찾기 위험은 남는다([web/lib/lesson-eight.ts:21](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:21>)). 이 판정은 활동 설계에 대한 판단이며 실제 학생 흥미는 미관찰이다. |

### 활동별 예상 시간 — 웹·Canva 통합

단위는 분이며 모두 설계 추정이다. 웹 기록과 Canva 실습을 한 흐름으로 계산하고 정적 그림 점검을 별도 실행 활동처럼 중복 가산하지 않는다. 작은 두 기능 앱의 생성 1회·수정 1회, 계정 사용 가능, 직전 차시의 Canva 조작 경험을 가정한다. 기존 한 기능 작품을 확장하거나 새 작품을 생성하는 경로 모두 가능하나, 아래는 작은 두 기능 앱을 요청하는 기준이다. 생성 지연·타이핑·학생 반응의 실제 수업 측정은 없다. 짝 설명은 교사가 선택해 넣는 운영 제안이다.

| 활동 | 구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 도입·웹 연결 개념 확인 | 운영+웹 필수 | 2~3 | 3~4 | 4~5 | 목표·앞/뒤 기능·정답 확인 |
| 첫 기능·값·다음 기능 선택 | 웹 필수 | 1~2 | 2~3 | 3~4 | 세 칸 연결 |
| 제작 지시 45자 이상 | 웹 필수 | 2~3 | 4~6 | 7~9 | 조건 포함·안전 확인·입력 |
| 웹→Canva 이동·지시 붙여넣기 | 실제 수업 | 1~2 | 2~3 | 3~5 | 탭 찾기·대상 작품 확인 |
| Canva 앱 생성/확장·대기 | 실제 수업 | 2~3 | 3~6 | 6~10 | 생성 1회; 대기 중 예상 정리 |
| 5분·15분·미선택 실행·짝에게 흐름 설명 | 실제 수업+운영 제안 | 3~4 | 5~7 | 8~11 | 입력별 결과·예외·값 전달 확인 |
| 웹 수정 지시 15자·Canva로 전달 | 웹 필수+전환 | 1~1 | 1~2 | 2~3 | 관찰한 상황과 원하는 결과 |
| Canva 한 곳 수정 생성·같은 조건 재시험 | 실제 수업 | 2~4 | 4~6 | 7~10 | 변경 대기·회귀 확인 |
| 웹 퀴즈·오답 재시도 | 웹 필수 | 2~3 | 3~4 | 5~6 | 3문항·이유 확인 |
| 성찰 | 웹 필수 | 1~2 | 2~3 | 3~4 | 자기 시험 사례 한 문장 |
| Canva 작품·웹 저장 확인·정리·전환 | 운영 | 2~3 | 3~4 | 5~7 | 양쪽 기록과 남은 조건 확인 |
| **전체 합계** | 선택 게시 제외 | **19~30** | **32~48** | **53~74** | 일반은 경계, 지원은 초과 가능 |
| 성찰 게시/앱 보관함 등록 | 선택·합계 제외 | 1~2 | 2~4 | 3~5 | 앱 보관함은 기존 기능, 등록은 완료와 독립 |

### 유지·축소·수정·추가 제안

**유지:** 첫 결과를 다음 기능에 쓰는 목표, 세 상황, 문제 상황을 포함한 수정 지시. 실제 Canva 수행을 새로 추가할 외부 선택 과제로 취급하지 않는다.

**축소:** 개인정보 오답의 반복 해설·정적 화면의 가상 조작·예시 전체 재타이핑을 줄이고 두 기능에 집중한다. 문장 틀을 사용해 지시 일반 4~6분→4분, 시험 5~7분→5분, 한 곳 수정·재시험 4~6분→6분으로 배분한다. 준비 화면은 결과 형태를 읽는 참고 자료로 짧게 사용한다.

**교사 전환 안내(지금 소스 변경 없이 적용 가능):** “웹에 제작 지시를 적고 확인한 뒤 Canva 탭에 붙여 넣으세요. 이 페이지의 그림이 아니라 자신의 Canva 앱에서 5분·15분·미선택을 시험하세요. 실제 나온 결과를 본 뒤 웹 체크로 돌아오세요.” 기대 결과를 지시와 맞추는 예시는 “5분에는 준비물 없는 짧은 스트레칭, 15분에는 종이와 연필을 쓰는 긴 활동을 추천해 줘. 시간을 고르기 전 추천 버튼을 누르면 먼저 시간을 선택하라는 안내를 보여 줘.”다. 실제로 이 조건을 충족한 때만 긍정형 체크를 한다.

**추가 제안:** 대기 중 작성할 `입력/예상/실제/수정 후` 3행 시험표와 짝에게 값 전달을 설명하는 1분. 이 시험표·짝 절차가 웹에 이미 구현된 것으로 쓰지 않는다. 향후 문구 수정은 “이번에는 첫 기능의 결과를 다음 기능에 연결하는 앱을 만들어요”, “Canva에서 시험한 결과를 기록해요”로 제안한다.

### 40분 운영안 — 현행 입력·체크를 유지한 실제 Canva 수업

| 운영 흐름 | 분 |
|---|---:|
| 도입·웹 연결 개념 | 3 |
| 기능·값·기능 선택 | 3 |
| 틀을 사용한 제작 지시·안전 확인 | 4 |
| Canva 이동·지시 전달 | 2 |
| 앱 생성/확장·대기 중 예상 정리 | 5 |
| 실제 5분·15분·미선택 시험 | 5 |
| 짝에게 값 전달과 관찰 한 사례 설명 | 1 |
| 웹 수정 지시·Canva 전달 | 1 |
| Canva 수정 생성·같은 조건 재시험 | 6 |
| 웹 퀴즈 | 4 |
| 성찰 | 2 |
| 양쪽 저장·정리·전환·여유 | 4 |
| **합계** | **40** |

빠른 학생은 선택 과제로 10분·연속 선택을 추가 시험한다. 지원 학생은 기본 지시 틀과 교사의 5분 시험 시연을 이용하되 자기 Canva 앱에서 직접 세 조건을 확인한다. 추가 꾸미기·선택 시험은 40분표에 들어 있지 않으므로 이를 생략해 표 안의 시간을 확보했다고 계산하지 않는다. 생성 대기가 수업 17분 시점의 예산을 넘으면 원본 접근이 가능한 기존 작동 작품을 시험 대상으로 사용할지 바로 판단하고, Canva 시험·수정은 수업 30분에 종료한다. 남은 10분은 웹 퀴즈 4분·성찰 2분·저장/정리 4분으로 보호한다. 생성/수정이 끝나지 않거나 세 조건이 실패하면 마지막 작동 버전·관찰·지시·미완료 진도를 저장하고 다음 시간의 미충족 시험/수정으로 인계한다. 이미 동작하는 Canva 작품을 실행하는 것이 우선 대안이며 종이 자료는 마지막 개념 설명용이다. 도구 정상 작동 전제에도 개별 생성 결과의 성공과 시간 내 완료는 보장하지 않는다. **실제 Canva에서 세 결과를 확인하고 웹의 나머지 필수 조건을 채웠다면 현행 코드에서도 정직하게 완료할 수 있다. 소스 수정이 선행되어야 한다는 이전 결론은 철회한다.**

**안전 검사로 막힐 때:** 제작 지시에 안전한 부정문이 들어가 금지어 검사에 걸려도 교사 확인만으로 완료 버튼이 풀리지는 않는다. 실제 개인정보는 삭제하고, 안전한 의도를 설명한 부정문이라면 기능 설명과 “개인정보 입력 없이 사용할 수 있게”처럼 같은 의도를 보존한 일반 표현으로 고쳐 해당 길이·안전 검사를 다시 확인한다. 해결되지 않으면 필수 조건을 강제로 체크하지 않고 해당 글과 미완료 진도를 보존한다. 의미를 구별하는 검사 개선은 후속 소스 수정 제안이며 이번에는 적용하지 않는다.

### 완료·기록·수정 영향

교사 이동 안내·실제 Canva 시험·기존 글칸에 관찰을 적는 운영은 완료 조건·3점 퀴즈·키를 바꾸지 않는다. 웹은 체크의 참 여부를 저장하지만 Canva 실행·성공을 자동 검증하지 않으므로 교사 관찰/시험표를 자기보고와 구별한다. 앱 보관함에는 공유 링크를 저장해 다시 실행할 수 있다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)); 수정은 Canva 원본 작품에서 한다. 향후 관찰/재시험 필드를 추가하면 기본값·과거 `testChoices`의 자기보고 의미·완료 해제를 검토한다. 보기 순서 변경은 숫자 `answers` 복원 호환성이 필요하다([web/lib/lesson-eight.ts:106](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:106>)). 이번에는 문서 검토만 수행한다.

## 9차시 — 나에게 필요한 앱 만들기

### 현재 구성과 완료 근거

모든 학생의 Canva 계정·AI 코드 사용 가능이라는 사용자 확인을 적용한다. 웹 계획·기록과 Canva 실제 제작·사용자 시험을 연결하는 수업으로 재검토하며 계정 준비 비용은 제외한다. 목표 문구는 생활 문제에서 두 기능 앱의 제작·테스트 계획을 완성하는 것이다([web/app/lesson/9/page.tsx:281](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/page.tsx:281>)). 실제 수업에서는 이 계획을 Canva에 전달해 자기 앱을 만들고 확인한다. 선수 지식은 두 기능의 연결, Canva 생성·수정, 예상과 관찰 비교다.

웹 5단계는 ① 생활 불편 3개 중 선택 ② 사용자·문제 15자·두 기능 각 10자 ③ 앱 이름 2자·제작 지시 60자 ④ 체크 3개·가상 친구 사례 선택·수정 지시 15자 ⑤ 퀴즈 3개·성찰 10자다([web/app/lesson/9/content.tsx:23](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:23>)). 실제 결과물은 Canva 개인 앱·사용/수정 결과이며 웹에는 계획·지시·체크·성찰이 저장된다([web/app/lesson/9/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/page.tsx:61>)). 웹 그림의 본문이 고정이라는 사실은 Canva 개인 앱이 획일적이라는 근거가 아니다([web/app/lesson/9/content.tsx:50](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:50>)). 웹 가상 친구 사례와 실제 짝에게 받은 의견도 구별한다([web/app/lesson/9/content.tsx:52](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:52>)).

필수 완료는 `needChoice/needChecked`, `targetUser=0`·문제/기능 길이·안전·`planChecked`, 이름/60자 지시·안전·`promptChecked`, `testChoices` 모두 참·`feedbackChoice=1`·15자 수정·`testChecked`, 퀴즈 모두 정답·`quizChecked`, 성찰 10자다([web/lib/lesson-nine.ts:145](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:145>)). `activity_data` 실제 키는 `needChoice`, `needChecked`, `targetUser`, `problem`, `featureOne`, `featureTwo`, `planChecked`, `appName`, `buildPrompt`, `promptChecked`, `testChoices`, `testChecked`, `feedbackChoice`, `revisionPrompt`, `answers`, `quizChecked`이며 성찰은 별도다([web/lib/lesson-nine.ts:44](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:44>)). 성찰 게시·앱 보관함 등록은 선택이다([web/app/lesson/9/page.tsx:306](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/page.tsx:306>)).

### 네 기준 평가

| 기준 | 판정 | 강점·문제·근거와 예상되는 어려움 |
|---|---|---|
| 교육적 효과 | 보완 필요 | 자기 생활 문제를 두 기능으로 바꾸고 Canva에서 실행하는 흐름은 앞 차시의 배움을 적용할 기회다. `planIsReady`는 대상 사용자 선택·길이·안전만 확인하고 두 기능의 의미 연결을 검사하지 않는데 “두 기능이 구체적으로 연결됐다”고 표시하므로 계획의 타당성은 사람이 확인해야 한다([web/app/lesson/9/content.tsx:36](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:36>), [web/lib/lesson-nine.ts:131](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:131>)). 준비 화면을 자기 앱이라고 생각하는 안내만으로는 실제 Canva 작품과 비교하는 이동·기록 방법이 부족하다([web/app/lesson/9/content.tsx:49](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:49>)). |
| 6학년 수준 | 우선 개선 | 문제·기능 둘·이름·제작 지시·수정·성찰의 7개 글 입력칸에 Canva 조작과 시험이 이어져 사고·작성·탭 전환 부담이 커진다([web/app/lesson/9/content.tsx:33](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:33>), [web/app/lesson/9/content.tsx:43](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:43>)). 기존 계획 문장을 합쳐 쓰는 틀과 범위 제한이 필요하다. 금지어 검사는 “비밀번호를 요구하지 않는다” 같은 안전한 부정문도 거절한다([web/lib/lesson-nine.ts:126](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:126>)). |
| 40분 분량 | 우선 개선 | 새 주제 신규 제작 일반 42~61분, 지원 69~97분 추정으로 초과 위험이 크다. 기존 앱을 자기 문제에 맞게 바꿀 수 있으면 일반 40~58분이다. 계획 중복 작성·새 앱 생성·시험·수정·저장을 모두 무제한 수행하기보다 작은 두 기능·수정 1회로 제한해야 한다. |
| 재미·흥미도 | 적절 | 세 생활 주제와 앱 이름·기능 문장에 선택권이 있고 자기 설계가 Canva 실행 결과로 나타난다([web/lib/lesson-nine.ts:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:9>), [web/app/lesson/9/content.tsx:41](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:41>)). 이는 의미 있는 제작·문제 해결 과제다. 첫 보기 정답 퀴즈와 가상 사례 선택의 도전은 낮으므로 자기 실제 결과를 설명하게 보완한다([web/lib/lesson-nine.ts:23](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:23>)). 실제 만족감·흥미도는 미관찰이다. |

### 활동별 예상 시간 — 새 주제 신규 제작 기준

모든 범위는 실측이 아니다. 새 앱 1개·두 기능·생성 1회·수정 1회, 계정/Code 사용 가능을 가정한다. 실제 짝 시험은 웹 구현이 아니라 아래 운영에 넣는 교사 제안이다. 이전 Canva 작품의 계획/지시를 수동 재사용하며, 정적 그림 시험 시간을 실제 앱 시험에 덧붙이지 않는다.

| 활동 | 구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 도입·이전 작품/계획 확인 | 운영 | 2~3 | 3~4 | 4~5 | 자기 문제의 범위 설정 |
| 생활 문제 선택 | 웹 필수 | 1~1 | 1~2 | 2~3 | 세 필요 비교 |
| 사용자·문제·기능 둘 작성 | 웹 필수 | 3~4 | 6~8 | 10~14 | 관계 사고·세 문장·안전 확인 |
| 앱 이름·제작 지시 통합 | 웹 필수 | 3~4 | 6~8 | 10~13 | 기존 문장 재사용·60자 이상 |
| 웹→Canva 이동·지시 전달 | 실제 수업 | 1~2 | 2~3 | 3~5 | 작품/탭 확인·붙여넣기 |
| 새 주제 앱 생성·대기 | 실제 수업 | 3~5 | 5~8 | 8~12 | 두 기능 신규 생성 |
| 자기 앱 두 기능·안전·목표 시험 | 실제 수업 | 3~4 | 5~7 | 8~11 | 계획과 실제 결과 대조 |
| 짝 사용·의견·가상 사례 판단 구별 | 운영 제안+웹 필수 | 1~2 | 2~3 | 3~5 | 실제 관찰과 예시 선택 |
| 웹 수정 지시·Canva 전달 | 웹 필수+전환 | 1~1 | 1~2 | 2~3 | 어디서/무엇을/어떻게 |
| Canva 수정 생성·동일 순서 재시험 | 실제 수업 | 2~3 | 4~6 | 7~10 | 수정 1회·결과 확인 |
| 퀴즈 | 웹 필수 | 2~3 | 3~4 | 5~6 | 3문항·재시도 |
| 성찰 | 웹 필수 | 1~2 | 2~3 | 3~4 | 사용자·도움·관찰 |
| 양쪽 저장·정리·전환 | 운영 | 2~3 | 2~3 | 4~6 | 작품/기록 저장·남은 조건 |
| **신규 제작 전체 합계** | 선택 게시 제외 | **25~37** | **42~61** | **69~97** | 일반·지원은 초과 위험 |
| 성찰 게시/앱 보관함 등록 | 선택·합계 제외 | 1~2 | 2~4 | 3~5 | 차시 완료와 독립 |

**기존 작품을 재사용할 수 있는 경우:** 8차시 쉬는 시간 앱을 선택 주제와 맞게 바꾸는 경우처럼 같은 문제에 적용할 작품이 있을 때만 신규 생성 행을 빠름 2~3/일반 3~5/지원 5~8분으로 대체한다. 합계는 **24~35/40~58/66~93분**이다. 준비물·책 기록처럼 다른 주제를 고른 학생 모두에게 이 절감을 적용하지 않는다. 앱 보관함에서 공유 링크를 다시 실행할 수 있고([web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)), 수정은 원본 Canva 프로젝트 또는 AI 코드 대화를 다시 열 수 있다는 운영 가정하에 진행한다. 공유 URL은 실행·시험·발표 재사용 수단이며 원본 편집 접근을 보장하지 않는다. 실제 개별 작품 보유·품질·생성 대기시간은 이번 검토에서 관찰하지 않았다.

### 유지·축소·수정·추가 제안

**유지:** 생활의 작은 불편, 사용자, 두 기능 제한과 구체적 수정 지시. 실제 Canva 제작은 확인된 수업 맥락이다.

**축소:** 문제·두 기능을 다시 길게 필사하기보다 기존 문장을 수동 복사해 연결 조건을 덧붙인다. 문제/기능 작성 6~8분→5분(문제 선택 포함), 지시 통합 6~8분→4분, 실제 시험 5~7분→4분을 목표로 한다. 화면 꾸미기·세 번째 기능·주제 변경은 선택으로 남긴다.

**교사 안내(현행 코드에서 적용 가능):** “웹 계획을 Canva에 붙여 넣어 자기 앱을 만드세요. 준비 그림은 화면 형태 예시입니다. 자기 Canva 앱에서 두 기능을 차례로 써 보고 웹 체크로 돌아오세요. 예시 친구의 말과 실제 짝의 말은 구별해서 기록합니다.” 지원 틀의 예시는 문제 “준비물을 빠뜨리지 않고 쉽게 확인하고 싶어요”, 기능1 “과목을 고르면 필요한 준비물 목록을 보여 줘요”, 기능2 “선택한 과목의 준비물을 체크해 준비 상태를 알려 줘요”다. 제작 지시는 이 세 문장과 “첫 기능의 선택 결과를 두 번째 기능에서도 사용해 줘”를 합쳐 길이·연결·결과를 확인한다.

**추가 제안:** 짝이 실제 앱을 설명 없이 사용해 막힌 화면을 한 개 찾고 `revisionPrompt`에 “__화면에서 __가 어려웠어요. __로 바꿔 줘”라고 적는다. 현재 짝 시험 절차는 웹에 없다. 향후 자동 피드백은 “길이와 안전 조건을 확인했어요. 두 기능의 연결은 실제 앱에서 확인하세요”로 한정하고 Canva 이동·복귀 안내를 명시하는 문구 개선을 제안한다.

### 40분 운영안 — 작은 신규 앱 또는 맞는 기존 앱을 활용

조건은 주제를 수업 초반에 확정하고, 작은 두 기능·기존 계획 재사용·한 곳 수정에 한정하는 것이다. 신규 제작도 5분 생성 예산 안에서 진행하도록 설계했으나 생성 결과/지연을 실측으로 보장하는 표는 아니다. 현행 필수 입력을 생략하지 않는다.

| 운영 흐름 | 분 |
|---|---:|
| 도입·이전 계획 확인 | 2 |
| 문제 선택·사용자/문제/두 기능 틀 작성 | 5 |
| 이름·계획을 합친 제작 지시·안전 확인 | 4 |
| Canva 이동·지시 전달 | 2 |
| 실제 앱 생성/기존 앱 적응·대기 중 예상 정리 | 5 |
| 두 기능·목표·안전 직접 시험 | 4 |
| 짝 사용·구체적 의견·웹 가상 사례 선택 | 3 |
| 웹 수정 지시·Canva 한 곳 수정 생성·재시험 | 6 |
| 퀴즈 | 3 |
| 성찰 | 2 |
| 양쪽 저장·정리·전환·여유 | 4 |
| **합계** | **40** |

빠른 학생은 선택으로 기능 간 값이 사라지는 조건을 추가 시험한다. 지원 학생은 한 주제의 계획 틀을 쓰되 자신의 조건 하나를 정하고 결과를 직접 확인한다. 추가 기능·꾸미기·다른 주제 재생성은 40분표 밖의 선택이므로 생략으로 표 안의 시간이 늘어나는 것으로 계산하지 않는다. 최초 생성은 수업 18분 시점에 준비 상태를 판단하고, 가능한 자기 원본을 최소 수정하는 경로로 전환하거나 현재 결과를 남긴다. Canva 시험·수정은 수업 31분에 종료해 웹 퀴즈 3분·성찰 2분·저장/정리 4분을 보호한다. 원본이 없으면 교사가 사전에 준비한 편집 가능한 Canva 예제 활용을 대안으로 제안하며, 준비되지 않은 대안이 있는 것으로 가정하지 않는다. 실패·시간 초과 때는 마지막 버전·관찰·수정 지시·미완료 진도를 저장하고 미충족 시험/수정을 다음 시간으로 인계한다. **실제 Canva 앱에서 목적·두 기능·안전을 확인하고 웹의 나머지 필수 입력·예시 판단·퀴즈·성찰 조건도 채웠다면 현행 체크와 완료를 사실대로 충족할 수 있다. 웹 정적 그림만 보고 학생 개인 앱도 실행되지 않는다고 단정하지 않는다.**

**안전 검사로 막힐 때:** 문제·기능·제작 지시에 안전한 부정문이 들어가 금지어 검사에 걸려도 교사 확인만으로 완료 버튼이 풀리지는 않는다. 실제 개인정보는 삭제하고, 안전한 의도를 설명한 부정문이라면 기능 설명과 “개인정보 입력 없이 사용할 수 있게”처럼 같은 의도를 보존한 일반 표현으로 고쳐 해당 길이·안전 검사를 다시 확인한다. 해결되지 않으면 필수 조건을 강제로 체크하지 않고 해당 글과 미완료 진도를 보존한다. 의미를 구별하는 검사 개선은 후속 소스 수정 제안이며 이번에는 적용하지 않는다.

### 완료·기록·수정 영향

교사 전환 안내·수동 문장 재사용·Canva 수행은 기존 키·완료식·3점 퀴즈를 그대로 사용할 수 있다. 단, 길이/안전 검사 통과와 두 기능의 의미·실제 동작 성공은 별도로 관찰해야 한다. `revisionPrompt`에 실제 위치·문제·바라는 결과를 기록하면 기존 타입 안에서 근거를 보강할 수 있고 웹 가상 사례를 실제 의견처럼 쓰지 않는다. 향후 관찰/작품 연결을 필수화하면 새 키 기본값·과거 자기보고 체크 해석·완료 해제를 검토한다. 보기 순서 변경 시 숫자 답안 복원은 유지되어야 한다([web/lib/lesson-nine.ts:121](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:121>)). 이번에는 검토만 기록한다.

## 10차시 — 공유하고 개선하기

### 현재 구성과 완료 근거

Canva 계정과 AI 코드 정상 작동이라는 사용자 확인을 반영한다. 기본 수업은 **9차시에서 만든 실제 Canva 앱을 재사용**해 소개·의견 수집·AI 수정 생성·재시험하고 웹에 기록하는 흐름이다. 이 차시에서 새 앱을 처음부터 다시 만드는 것으로 계산하지 않는다. 이전 작품과 편집 가능한 원본 Canva 프로젝트/AI 코드 대화를 저장해 다시 열 수 있다는 것은 운영안의 조건이며 학생별 보유·편집 접근을 확인한 결과는 아니다. 공유 URL만으로 수정 가능한 원본까지 확보됐다고 판단하지 않는다. 앱 보관함의 공유 링크로 기존 결과를 열 수 있어 수동 연결도 가능하다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)).

목표는 앱을 안전하게 소개하고 구체적 피드백을 골라 테스트·개선에 활용하는 것이다([web/app/lesson/10/page.tsx:272](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:272>)). 선수 지식은 자기 앱의 목표·두 기능·사용 순서, Canva 수정 요청과 재시험이다. 웹 5단계는 ① 안전 공유 선택 ② 이름 2자·문제 15자·기능 연결 20자·사용 순서 20자 ③ 피드백 예시 3개 판단 ④ 선택 피드백 15자·개선 계획 20자·최종 체크 4개 ⑤ 퀴즈 3개·성찰 10자다([web/app/lesson/10/content.tsx:15](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/content.tsx:15>)). 실제 수업 결과물은 발표한 앱·실제 의견·개선 전후·재시험이며 웹에는 발표 카드·예시 판단·계획·자기보고 체크가 저장된다([web/app/lesson/10/page.tsx:59](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:59>)). 예시를 분류했다고 실제 친구 의견을 받은 것은 아니지만 교실에서 의견을 받을 수 없다는 뜻도 아니다.

필수 완료는 `shareChoice=0/shareChecked`, 발표 글 길이·안전·`presentationChecked`, `feedbackChoices=[1,0,1]/feedbackChecked`, 피드백/계획 길이·`finalChoices` 전부 참·`improvementChecked`, 퀴즈 전 정답·`quizChecked`, 성찰 10자다([web/lib/lesson-ten.ts:107](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:107>)). `activity_data` 실제 키는 `shareChoice`, `shareChecked`, `appName`, `problemSummary`, `featureSummary`, `demoSteps`, `presentationChecked`, `feedbackChoices`, `feedbackChecked`, `chosenFeedback`, `improvementPlan`, `finalChoices`, `improvementChecked`, `answers`, `quizChecked`이며 성찰은 별도다([web/lib/lesson-ten.ts:28](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:28>)). 성찰 게시·보관함 등록은 선택이다([web/app/lesson/10/page.tsx:297](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:297>)).

### 네 기준 평가

| 기준 | 판정 | 강점·문제·근거와 예상되는 어려움 |
|---|---|---|
| 교육적 효과 | 보완 필요 | 구체적 위치/원하는 변화가 있는 피드백을 구분한 뒤 자기 Canva 앱을 개선하면 실제 사용자 중심 반복을 배울 수 있다([web/lib/lesson-ten.ts:9](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:9>)). 웹은 수정 뒤 시험할 “계획”을 쓰게 하지만 최종 체크에는 “친구 피드백을 확인하고 한 가지 이상 개선했어요”가 있다([web/app/lesson/10/content.tsx:21](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/content.tsx:21>), [web/lib/lesson-ten.ts:19](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:19>)). 계획 뒤 Canva에 가서 실제 수정·재시험하고 돌아오라는 인계가 필요하다. 실제 수행 후에는 체크가 정직하게 가능하다. 웹 완료는 학생 자기보고이고 앱 개선을 자동 검증한 결과는 아니다. |
| 6학년 수준 | 보완 필요 | 세 의견 예시는 명확하다. 발표 4입력+선정 이유·전후 계획에 실제 발표·수정을 더하므로 9차시 계획을 수동 활용하는 틀이 필요하다([web/app/lesson/10/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/content.tsx:17>)). 10차시가 9차시 기록을 자동 로드하지 않는 사실은 수동 재사용/앱 보관함 연계가 불가능하다는 뜻이 아니다([web/app/lesson/10/page.tsx:71](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:71>)). 안전 정규식이 올바른 부정문도 거절하는 문제는 남는다([web/lib/lesson-ten.ts:99](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:99>)). |
| 40분 분량 | 우선 개선 | 기존 앱 재사용 일반 38~56분, 지원 64~89분 추정으로 실제 듣기·수정·재시험을 보장하기 어렵다. 전체 학급 순차 발표보다 동시 짝 발표, 기존 문장 활용, 수정 한 곳 제한으로 40분안을 설계한다. 새 앱까지 시작하면 초과 위험이 더 커진다. |
| 재미·흥미도 | 적절 | 자기 앱을 보여 주고 실제 친구가 막힌 곳을 고쳐 다시 성공하는 경험은 공유·성공·생활 문제 해결과 연결된다. 웹의 분류·체크만으로 수업 전체를 평가하지 않는다. 퀴즈 첫 보기 정답 반복은 보완 대상이다([web/lib/lesson-ten.ts:22](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:22>)). 실제 발표 만족감·학생 흥미는 관찰하지 않았다. |

### 활동별 예상 시간 — 9차시 실제 앱 재사용 기준

모두 추정이며 계정 발급/권한 준비·신규 앱 생성은 포함하지 않는다. Canva 수정 생성 1회·한 곳 개선·같은 조건 재시험을 포함한다. 동시 짝 발표 절차는 수업 운영 제안이며 웹에 이미 구현된 것으로 말하지 않는다.

| 활동 | 구분 | 빠름 | 일반 | 지원·재시도 | 추정 근거 |
|---|---|---:|---:|---:|---|
| 도입·9차시 앱/계획 열기 | 운영+기존 작품 | 1~2 | 2~3 | 3~4 | 자기 작품·목표 확인 |
| 안전 공유 선택·확인 | 웹 필수 | 1~2 | 2~3 | 3~4 | 공개 범위·정답 피드백 |
| 기존 계획 활용 발표 카드 | 웹 필수 | 3~4 | 6~8 | 10~13 | 네 글칸·사용 순서 |
| 세 피드백 예시 판단 | 웹 필수 | 2~3 | 3~4 | 5~6 | 구체성·사람 평가 구별 |
| Canva 이동·보여 줄 순서 준비 | 실제 수업 | 1~2 | 2~3 | 3~5 | 작품/탭·처음 상태 확인 |
| 짝 발표·상대 사용·실제 의견 교환 | 운영 제안+실제 수업 | 4~5 | 6~8 | 9~12 | 한 명씩 시연/사용/의견 |
| 의견 선택 이유·전후 계획 웹 기록 | 웹 필수 | 2~3 | 4~6 | 7~10 | 목표와 비교·반영 한 곳 |
| Canva 수정 요청·수정 생성 대기 | 실제 수업 | 2~3 | 3~6 | 6~10 | 수정 한 곳·변경 생성 |
| 같은 순서 재시험·최종 체크 | 실제 수업+웹 필수 | 2~3 | 3~5 | 6~9 | 실제 전후·회귀 확인 |
| 퀴즈 | 웹 필수 | 2~3 | 3~4 | 5~6 | 3문항·재시도 |
| 성찰 | 웹 필수 | 1~2 | 2~3 | 3~4 | 앞으로 실천·자기 사례 |
| Canva/웹 저장·정리·전환 | 운영 | 2~3 | 2~3 | 4~6 | 작품/완료 저장 상태 |
| **전체 합계** | 선택 게시 제외 | **23~35** | **38~56** | **64~89** | 일반·지원은 초과 위험 |
| 성찰 게시/보관함 링크 갱신 | 선택·합계 제외 | 1~2 | 2~4 | 3~5 | 완료와 독립 |

**이전 작품이 없는 학생의 별도 보충 조건:** 계획 확인·지시 전달·작은 앱 생성·최초 실행 확인에 빠름 6~10/일반 11~19/지원 16~30분을 추가할 수 있어 전체 **29~45/49~75/80~119분**으로 추정한다. 새 제작을 전원에게 요구하지 않으며 미완성 작품 보완은 수업 전후/다음 시간 지원으로 구분한다. 이는 실제 학생 현황이나 Canva 공식 응답 시간의 관찰값이 아니다.

### 유지·축소·수정·추가 제안

**유지:** 안전 공유, 유용한 피드백 3예시, 목표에 맞는 한 의견 선정과 수정 뒤 재시험. 실제 공유·Canva 개선은 확인된 수업 맥락에서 수행할 핵심이며 외부 추가 과제로 격하하지 않는다.

**축소:** 새 앱 생성·전원 순차 발표·9차시 내용의 반복 필사·장식 변경을 줄인다. 기존 계획으로 발표 카드 6~8분→5분, 의견/계획 기록 4~6분→3분, 짝 발표 6~8분→6분을 목표로 한다. 줄인 시간을 실제 수정 생성·재시험에 확보한다.

**교사 전환 안내(현행 코드에서 적용 가능):** “9차시 Canva 작품을 열고 발표 카드로 짝에게 소개하세요. 짝이 실제 사용한 뒤 구체적 의견을 한 개 줍니다. 웹에 반영할 이유와 계획을 적고 Canva에 수정 지시를 보내세요. 수정 후 같은 순서로 다시 시험하고 웹 최종 체크로 돌아오세요.” 실제 의견 예시는 “결과 화면에서 처음 화면으로 돌아가는 버튼을 찾기 어려워요. ‘다시 선택’ 버튼을 넣어 주세요.” 기록은 `chosenFeedback`에 의견과 선정 이유, `improvementPlan`에 개선 전→계획→실제 확인을 구분해 적는다. 예시 의견을 분류한 사실과 실제 받은 의견을 섞지 않는다.

**추가 운영 제안:** 동시 짝 발표(1분 소개+1분 사용+1분 의견을 교대)와 전후 화면 비교. 현재 웹의 자동 발표/의견 수집/Canva 수정 기능이 추가되는 것은 아니다. 향후 문구에는 “계획을 Canva에서 실행하고 다시 시험한 뒤 체크하세요”를 명시하고 의미 검증 없는 자동 칭찬을 제한한다. 10차시만으로 과정 완주 문구가 나오는 것은 다른 차시 완료를 자동 확인한 뜻이 아니므로 표현/전체 완료 확인 개선을 별도로 제안한다([web/app/lesson/10/page.tsx:314](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:314>)).

### 40분 운영안 — 기존 앱을 발표하고 Canva에서 실제 개선

조건은 9차시 작동 앱·계획·편집 가능한 원본 Canva 프로젝트 또는 AI 코드 대화를 다시 열 수 있고 한 기능/안내 한 곳만 고치는 것이다. 신규 앱의 최초 생성 시간은 이 40분안에 포함하지 않는다. 공유 링크는 앱 보관함이나 Canva 작품에서 찾고, 수정은 Canva 원본에서 한다. 현행 필수 글 입력·분류·퀴즈·체크를 생략하지 않는다.

| 운영 흐름 | 분 |
|---|---:|
| 도입·기존 앱/계획 열기 | 2 |
| 안전 공유 선택 | 2 |
| 이전 계획 활용 발표 카드 | 5 |
| 세 예시 피드백 판단 | 3 |
| Canva 이동·시연 준비 | 2 |
| 동시 짝 발표·사용·실제 의견 교환 | 6 |
| 웹 의견 선정 이유·개선 전후 계획 | 3 |
| Canva 수정 요청·수정 생성 | 5 |
| 동일 순서 재시험·실제 개선 확인·체크 | 3 |
| 퀴즈 | 3 |
| 성찰 | 2 |
| 양쪽 저장·정리·전환·여유 | 4 |
| **합계** | **40** |

빠른 학생은 선택으로 반영하지 않은 의견과 이유를 설명한다. 지원 학생은 이전 문장을 활용해 발표 틀을 읽고 버튼 이름/안내 한 줄처럼 작은 개선을 선택한다. 전체 순차 발표·추가 꾸미기는 40분표에 없으므로 이를 생략해 표의 시간을 확보했다고 계산하지 않는다. 수정 생성이 수업 28분까지 준비되지 않으면 마지막 작동 버전과 미반영 상태를 보존하고, Canva 재시험은 수업 31분에 종료한다. 남은 9분은 웹 퀴즈 3분·성찰 2분·저장/정리 4분으로 보호한다. 실제 수정이 반영되지 않으면 “개선했어요”를 체크하지 않고 실제 의견·계획·마지막 작품·미완료 진도를 저장해 다음 시간의 수정/재시험으로 인계한다. 자기 앱이 없는 학생에게는 별도 보충이나 준비된 편집 가능한 Canva 예제를 제안하되, 그것을 자기 새 앱 완성이나 실제 친구 의견 수집으로 오기록하지 않는다. **실제 친구 의견을 받고 Canva에서 한 가지 이상 개선해 재시험하며 두 기능의 순서·처음 보는 사람의 이해·개인정보 없이 사용도 확인하고, 웹의 발표 글·분류·선정 이유/계획·퀴즈·성찰 등 나머지 필수 조건을 채우면 소스 변경 없이 현행 최종 체크와 완료를 사실대로 충족할 수 있다. 모든 학생의 도구 이용 가능과 모든 학생의 시간 내 완료는 다르다.**

**안전 검사로 막힐 때:** 발표 카드에 안전한 부정문이 들어가 금지어 검사에 걸려도 교사 확인만으로 완료 버튼이 풀리지는 않는다. 실제 개인정보는 삭제하고, 안전한 의도를 설명한 부정문이라면 기능 설명과 “개인정보 입력 없이 사용할 수 있게”처럼 같은 의도를 보존한 일반 표현으로 고쳐 해당 길이·안전 검사를 다시 확인한다. 해결되지 않으면 필수 조건을 강제로 체크하지 않고 해당 글과 미완료 진도를 보존한다. 의미를 구별하는 검사 개선은 후속 소스 수정 제안이며 이번에는 적용하지 않는다.

### 완료·기록·수정 영향

수동 계획 재사용·교사 인계·교실 발표·Canva 수정은 기존 완료 조건·키·3점 퀴즈를 바꾸지 않는다. `chosenFeedback/improvementPlan`의 기존 글칸에 실제 의견·전후·확인을 구별해 남길 수 있다. 웹 체크의 참 값은 자기보고이며 Canva 개선을 서버가 검증한 증거로 해석하지 않는다. 앱 보관함은 공유 링크 재실행을 돕지만 차시 완료나 수정 성공과 별개다([web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>)). 향후 실제 작품/관찰 필드를 새 필수로 넣거나 `finalChoices` 의미를 바꾸면 과거 기록·복원 기본값·완료 해제를 설계한다. 자동 9차시 가져오기는 학생의 현재 10차시 글을 덮지 않아야 한다. 보기 순서를 바꾸면 숫자 답안 복원 호환성도 확인한다([web/lib/lesson-ten.ts:74](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:74>)). 이번 세션에서는 제안만 기록한다.

## 과정 전체의 난이도·중복·연결성

**Canva를 병행하면 설계→제작→시험→개선의 연결이 성립한다.** 1~2차시 명령 표현 비교 → 3차시 AI 확인·안전 → 4차시 구체적 요청 → 5~7차시 한 기능 제작·설계 → 8~9차시 두 기능·자기 문제 → 10차시 공유와 개선이라는 방향은 타당하다. 웹의 고정된 놀이 추천·두 기능 그림은 학습 예시이고, 실제 작동 결과는 학생의 Canva 앱에서 확인한다. 따라서 그 그림의 버튼에 이벤트가 없다는 사실을 전체 수업의 제작 기회 부재로 확장하지 않는다. 실제 수업에서 어떤 결과가 나왔는지는 이번에 관찰하지 않았다.

**화면을 옮기는 순간의 행동과 돌아와 남길 근거가 명확해야 한다.** 5~6차시에는 “실제 Canva AI를 부르지 않아도 괜찮아요”, 7~9차시에도 준비된 결과를 보라는 안내가 있다([web/app/lesson/5/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/5/content.tsx:17>), [web/app/lesson/6/content.tsx:17](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/6/content.tsx:17>), [web/app/lesson/7/content.tsx:10](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/7/content.tsx:10>), [web/app/lesson/8/content.tsx:63](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:63>), [web/app/lesson/9/content.tsx:49](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/9/content.tsx:49>)). 사용자 확인에 따라 본수업은 실제 Canva를 사용하므로 교사는 “이 그림은 예시입니다. 지금은 내 지시를 Canva에 옮겨 만든 앱을 시험하고, 이 화면으로 돌아와 결과를 적습니다”라고 안내할 수 있다. 계정·도구 준비를 반복할 필요는 없고, 이후 웹 문구를 그 수업 방식에 맞추는 것이 개선 과제다. 안내를 명확히 하는 것은 가능하지만 이번에 웹 문구를 수정하지는 않았다.

**이전 작품 재사용 수단은 이미 있다.** 앱 보관함은 5~10차시 작품의 이름·차시·공유 링크를 저장하고 새 탭에서 다시 여는 기능이다([web/app/my-apps/page.tsx:55](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:55>), [web/app/my-apps/page.tsx:61](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:61>), [web/app/my-apps/page.tsx:69](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/my-apps/page.tsx:69>)). 10차시가 자기 기록만 불러오는 사실([web/app/lesson/10/page.tsx:71](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/10/page.tsx:71>))은 차시 입력을 자동 가져오지 않는다는 뜻이다. 이전 Canva 작품을 수동으로 열어 발표·개선하는 수업을 막지는 않는다. 공유 URL은 실행·시험·발표용이며 원본 Canva 편집 프로젝트나 AI 코드 대화를 열어 주는 것으로 확인한 것은 아니다. 수정 시간 절감은 학생이 원본 프로젝트·대화를 유지하고 다시 열 수 있다는 운영안 가정이다. 작품 재사용·앱 보관함 등록은 현재 완료 함수가 요구하는 조건과 별개다.

**반복은 같은 앱에 새로운 판단을 더할 때 의미가 있다.** 5차시 도구 이해와 첫 생성, 6차시 입력·처리·결과의 한 기능 시험, 7차시 같은 앱의 사용자 흐름·불명확한 안내 개선, 8차시 값 전달과 미선택 시험, 9차시 생활 문제 적용, 10차시 실제 친구 의견에 따른 개선으로 역할을 나눌 수 있다. 이는 교사 운영 개선안이다. 매 차시 새 놀이 앱을 생성하고 긴 요청을 다시 쓰는 방식은 초과 위험을 키운다. 7차시는 6차시 작품, 10차시는 9차시 작품을 재사용하고 9차시는 두 기능 구조를 활용하면 제작 시간을 실제 사고·시험에 쓸 수 있다.

**난이도는 첫 수업 입력 부담과 마지막 글쓰기에 집중된다.** 1차시 기호 입력과 2차시 비교문 3개, 3~4차시의 정답 선택 문제는 기존 검토를 유지한다. Canva 관련 5~7차시는 같은 놀이·제작 지시·체크·수정 형식이 반복되고, 9차시는 문제·기능 2개·이름·제작 지시·수정·성찰의 7개 글 입력칸으로 늘어난다. 10차시는 발표 준비와 개선 계획을 다시 쓴다. 이전 웹 문장을 Canva에 옮기고 작품을 근거로 필요한 부분만 고쳐 쓰면 필사 부담을 줄일 수 있다. 글자 수는 입력 기준이며 제작 역량이나 사고의 깊이를 측정한 값이 아니다.

**개념·평가 문제는 Canva 사용 여부와 별개로 남는다.** 8차시 “두 기능 앱은 기능 두 개를 따로 놓은 앱이 아니에요”([web/app/lesson/8/content.tsx:32](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/app/lesson/8/content.tsx:32>))는 “이번에는 첫 기능의 결과를 다음 기능에 연결하는 두 기능 앱을 만들어요”로 범위를 제한하는 개선안을 유지한다. 7~10차시 퀴즈 정답이 모두 첫 보기인 문제도 유지한다([web/lib/lesson-seven.ts:8](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-seven.ts:8>), [web/lib/lesson-eight.ts:21](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-eight.ts:21>), [web/lib/lesson-nine.ts:23](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-nine.ts:23>), [web/lib/lesson-ten.ts:22](<C:/Users/rhkdd/OneDrive/문서/2학기 전학공/web/lib/lesson-ten.ts:22>)). 안전하지만 목적·순서·결과가 어긋나는 보기를 섞거나 실제 자기 앱의 한 사례를 설명하게 하면 정답 패턴 찾기보다 원리를 확인할 수 있다. 보기 순서 변경은 기존 숫자 답안의 복원 호환성 검토가 필요하다.

**성찰은 자기 Canva 앱에서 관찰한 변화에 연결한다.** 5 ‘내 지시 중 반영된 조건’, 6 ‘입력·버튼·실제 결과’, 7 ‘처음 사용자가 막힌 위치와 수정’, 8 ‘시간값이 추천에 전달된 증거’, 9 ‘내 문제를 해결한 경우와 남은 실패’, 10 ‘친구 의견·반영한 변화·재시험 결과’의 한 사례를 남긴다. 현재 웹 입력칸에 관찰을 짧게 포함하는 운영은 소스 변경 없이 가능하며, 관찰표·짝 시험 절차는 제안이다. 수행하지 않은 내용은 예상·계획으로 구분한다. 웹 체크는 학생 자기보고이고, 작품 확인과 함께 해석해야 한다.

## 개선 우선순위와 예상 시간 변화

아래 5~10차시 관련 판단은 Canva 병행 전제로 정정했다. 1~4차시의 기존 우선순위는 유지한다. 시간 변화는 설계 목표이며 실측 절감량이 아니다. 차시별 통합 추정과 40분 운영안을 기준으로 판단하며 웹 내부 시간에 외부 시간을 추가한 옛 합계는 사용하지 않는다.

| 순서 | 수정 제안과 교육적 이유 | 시간 영향·운영 판단 | 저장·완료 영향 |
|---|---|---|---|
| 1 | 3차시 안전 질문·선택지 기준, 4차시 오답에도 ‘맞아요’와 놀이/장소 문맥을 바로잡는다. | 기존 검토 유지. 기존 분류·도입 시간 안에서 교정. | 기존 검토 유지. 의미가 바뀐 과거 답을 새 평가로 해석하지 않음. |
| 1 | 5~10차시에서 웹 예시와 실제 Canva 앱의 역할, 이동 시점, 웹에 돌아와 남길 시험 결과를 명확히 안내한다. | 교사의 전환 안내는 현재 수업에서 적용 가능. 예시를 짧게 참고하고 실제 앱 시험으로 이어가 중복 검사를 피한다. | 안내만으로는 기존 키·완료 함수를 유지할 수 있음. 외부 작품 자동 검증·새 필수 증거를 넣는다면 별도 설계 필요. |
| 1 | 9차시 신규 앱 제작, 10차시 발표·수정·재시험의 초과 위험을 먼저 조정한다. | 새 기능은 두 개, 꾸미기는 선택, 수정은 작은 문제 1회. 7·10차시는 이전 작품 재사용. 상세 추정·40분 배분은 해당 절. | 현행 필수 입력을 생략하지 않음. 수행하지 못한 성공·개선 체크는 체크하지 않고 남은 작업을 문장으로 기록. |
| 1 | 5~10 안전 자동 확인을 형식 검사로 설명하고 안전한 부정문까지 거절하는 문제를 다룬다. | 작성 시간 안에서 사람 점검. 생성된 Canva 앱에도 불필요한 정보 입력칸이 없는지 직접 확인. | 안전 검사 변경은 기존 지시의 통과·완료 해제에 영향. 이번에는 수정 없음. |
| 2 | 1차시 기호 입력을 한 줄씩 시범·뜻 설명으로 지원하고 필요 시 관찰 선택화를 후속 설계한다. | 기존 검토 유지. 현재3개 모두 필수이며 수학 지원형10분 목표. | 선택화/순서 필수화는 기존 완료·복원 인정 기준 변경. |
| 2 | 5·6·7 역할을 첫 생성·한 기능 시험·사용자 흐름 개선으로 나누고 8·9·10에서 작품과 문장을 재사용한다. | 새 앱 생성·반복 작성 시간을 줄이고 시험·피드백에 배분. 절감량은 미측정이며 기존 앱 사용 가정을 각 표에 표시. | 수동 재사용과 앱 보관함은 기존 수단. 자동 가져오기는 현재 답 덮어쓰기 방지 필요. |
| 2 | 체크에 실제 시험의 한 근거를 연결한다. 5~7 검사 수행과 성공을 구분하고 8~10 결과·개선 진술은 실제 결과에 따라 기록한다. | 시험 중 한 줄 기록을 함께 수행하여 별도 기록 부담을 줄인다. 정적 그림만으로 성공 체크를 채우지 않음. | 기존 성찰·수정문 활용은 구조 유지. 시험표·관찰 결과를 새 필수 키로 넣는다면 기본값·구버전 완료 인정 기준 필요. |
| 3 | 3차시 근거 대조, 4차시 결과 비교의 기존 제안을 유지하고, 7~10차시는 실제 짝 의견과 작은 수정·재시험을 구체화한다. | 3·4 기존 검토 유지. 후반 Canva 수행은 새 외부 도구를 추가하는 일이 아니라 이미 정해진 수업의 질을 높이는 운영. | 보기 순서·완료 기준을 바꾸면 과거 저장 답 호환성 검토. |

위 제안은 구현 승인이나 배포 지시가 아니다. 후속 수정에서도 기존 `lesson_no`, `lesson_progress`, `activity_data`를 보존한다. 과거 참 체크는 당시 기준의 기록이며 새로운 작품 검증 증거로 소급 해석하지 않는다. 기존 기록을 빈값으로 덮거나 전체 초기화하는 방안을 제안하지 않았다.

## 실제 수업에서 확인할 항목 — 아직 미실시

학생의 Canva 계정·AI 코드 사용 가능 여부는 사용자 확인으로 확정했다. 아래는 **남아 있는 수업 관찰 계획**이며 이번 관찰 결과가 아니다. 계정 준비를 다시 검증하는 항목은 제외했다.

| 관찰 항목 | 교사가 남길 실제 근거 | 특히 확인할 차시 | 확인 목적 |
|---|---|---|---|
| 시간 | 웹 설명·작성, Canva 전환·생성·실행·수정·재시험, 웹 복귀·퀴즈·성찰·저장의 시작·끝과 남은 작업 | 전체, Canva 관련5~10 | 통합 시간 추정과40분 배분의 실제 차이, 생성 대기와 작업 시간 구분 |
| 도움 요청 | 어휘·질문·기호 입력·타이핑·지시 복사·화면 전환 중 도움 유형 | 1·3·4·8·9 | 기존 지원 과제와 두 화면 이동 지원의 필요성 |
| 오개념 | 구체적 지시가 항상 정답을 보장하는지, 검사 수행과 정상 동작이 같은지에 대한 학생 설명 | 5~10;1·2 기존 항목 유지 | 체크·퀴즈 외 원리 이해 확인 |
| 실행·재시도 | Canva 입력·예상·실제 결과·수정 전후·같은 조건 재시험 한 묶음 | 5~9 | 사용자 확인된 도구 사용 가능성과 학생 앱의 조건 충족 구분 |
| 결과물 | 지시 조건 반영, 기능1 값의 기능2 전달, 문제 해결 여부, 작품 링크로 이전 앱 다시 열기 | 5~10 | 자기보고 완료와 작품 품질·차시 연결의 구분 |
| 흥미·참여 | 앱을 더 시험하려는 행동, 생활 문제 선택 이유, 반복 작성·대기·전환에서 막힌 지점, 짧은 학생 의견 | 전체 | 실제 제작이 관심을 높였는지, 어떤 부담이 남는지 |
| 공유·개선 | 실제 친구가 막힌 위치·받은 의견·선정 이유·고친 부분·재시험 결과 | 10 | 발표 준비와 실제 피드백·개선 구분 |
| 생성·수정 대기 | 지시 제출부터 결과까지 걸린 시간, 수정 횟수·오류·복구, 대기 중 수행한 다른 과제 | 5·6·8·9·10 | 추정 범위와 수정1회 가정 검증; 계정·권한 준비 확인은 제외 |

관찰 기록 예: `차시/단계 | 웹/Canva | 실제 분 | 도움 유형 | 입력·예상·관찰 | 수정·재시험 | 학생 의견 | 실제/모의`. 현재 관찰값은 비어 있다. 정답 수·완료율만으로 효과·흥미 향상을 단정하지 않고 작품·학생 설명·수정 전후 결과와 함께 본다.

## 검토 산출물 확인

1~4차시의 기존 검토는 유지했다. 5~10차시의 평가·활동별3수준 시간·합계·40분 운영안·지원·미완료 대응을 웹↔Canva 수업으로 재검토했고 관련 요약·연결성·우선순위를 정정했다. 계정·Code 작동과 웹↔Canva 수업 방식은 사용자 확인, 소스·완료 조건은 문서 확인, 수업 시간·효과·흥미는 추정이며 실제 학생 수업 관찰은 미실시다. 활동별 시간표 10개의 합계, 40분 운영안 10개(수식 7개·표 3개), 파일·줄 근거 링크 245개, 1~4차시 상세 절과 요약 행의 원문 보존을 문서 검증으로 확인했다. 소스 변경이 없어 lint/build·학생E2E를 실행하지 않았으며 운영 사이트·DB·학생 기록·배포를 그대로 두었다.
