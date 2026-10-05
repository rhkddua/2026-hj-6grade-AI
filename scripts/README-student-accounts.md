# 학생 계정 일괄 발급

이 도구는 계정 목록 Excel 파일을 읽어 Supabase Auth 사용자와 `student_profiles` 행을 일괄 생성합니다. 기본 실행은 사전 점검만 하며, 실제 발급은 `--apply`와 프로젝트 확인 문구를 모두 입력해야 합니다.

## 실행 방법 (Windows PowerShell)

```powershell
python -m pip install -r .\scripts\requirements-student-accounts.txt
python .\scripts\create_student_accounts.py "$env:USERPROFILE\Downloads\6학년 학생 계정 목록.xlsx"
```

사전 점검 결과가 맞으면 실제 발급을 실행합니다.

```powershell
python .\scripts\create_student_accounts.py "$env:USERPROFILE\Downloads\6학년 학생 계정 목록.xlsx" --apply
```

실행 중 Supabase `secret` 키 또는 기존 `service_role` 키를 입력합니다. 입력값은 화면에 표시되지 않고 파일이나 환경변수에 저장되지 않습니다. 마지막 확인 질문에 대상 프로젝트 ref를 그대로 입력해야 생성이 시작됩니다. 기본 대상은 이 수업의 프로젝트 `ujhcwxscxepbttqcysal`입니다.

## 처리 내용

- 명단의 반, 번호, 이메일, 비밀번호를 읽고, 각 비밀번호 앞에 `2026`을 붙여 8자로 발급합니다. 원본 엑셀은 수정하지 않습니다. 이 파일에는 학생 이름 열이 없어, 프로필 표시 이름은 `6-반-번호` 형식으로 만듭니다. 이름 열을 `이름` 또는 `student_name`으로 추가하면 해당 값을 사용합니다.
- `email_confirm: true`로 계정을 확인 상태로 생성합니다. 학생들에게 확인 메일을 보내지 않습니다.
- `student_name`, `grade`, `class_no`, `student_no` 메타데이터로 앱의 학생 프로필을 연결합니다. 데이터베이스 트리거가 프로필을 만들지 않은 경우에는 관리자 API로 프로필을 보완합니다.
- 이미 이메일과 프로필이 연결된 학생은 건너뜁니다. 기존 계정의 반·번호가 다르거나 다른 계정이 해당 반·번호를 사용 중이면 새 계정 생성 전에 중단합니다.
- 비밀번호, API 키, 이메일 주소, API 응답 본문을 콘솔에 출력하지 않습니다.

관리자 키는 `service_role` 또는 `secret`처럼 RLS를 우회할 수 있는 권한입니다. 이 스크립트에 키를 적거나 웹 앱에 넣지 말고, 신뢰할 수 있는 로컬 컴퓨터에서만 실행하세요.
