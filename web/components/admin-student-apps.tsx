'use client';

import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Eye,
  EyeOff,
  History,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  queryAdminApps,
  manageApps,
  loadAppAudit,
  appManagementError,
  appActionLabels,
  type AppAction,
  type AdminStudentApp,
  type AdminAppsResult,
  type AppAudit,
} from '@/lib/admin-student-apps';

const date = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
const selectClass =
  'h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-teal-600';
type Pending = { action: AppAction; entries: AdminStudentApp[] };
type Receipt = Pick<
  AdminStudentApp,
  'id' | 'student_name' | 'class_no' | 'student_no'
>;

export function AdminStudentApps() {
  const [filters, setFilters] = useState({
    classNo: 'all',
    lesson: 'all',
    status: 'all',
    search: '',
    sort: 'newest',
    page: 0,
  });
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<AdminAppsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [edit, setEdit] = useState({ title: '', lesson: 5, url: '' });
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [auditEntry, setAuditEntry] = useState<Receipt | null>(null);
  const [audit, setAudit] = useState<AppAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const entries = result?.entries ?? [];
  const selected = entries.filter((entry) => checked.includes(entry.id));
  const pages = Math.max(1, Math.ceil((result?.total ?? 0) / 50));
  const canManage = !loading && !error && !busy;

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void queryAdminApps(filters)
        .then((data) => {
          if (!active) return;
          const lastPage = Math.max(0, Math.ceil(data.total / 50) - 1);
          if (filters.page > lastPage) {
            setFilters((current) => ({ ...current, page: lastPage }));
            return;
          }
          setResult(data);
          setError('');
          setLoading(false);
        })
        .catch((failure) => {
          if (active) {
            setResult(null);
            setError(appManagementError(failure));
            setLoading(false);
          }
        });
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters, retry]);
  useEffect(() => {
    if (!auditEntry) return;
    let active = true;
    void loadAppAudit(auditEntry.id)
      .then((data) => {
        if (active) setAudit(data);
      })
      .catch((failure) => {
        if (active) setAuditError(appManagementError(failure));
      })
      .finally(() => {
        if (active) setAuditLoading(false);
      });
    return () => {
      active = false;
    };
  }, [auditEntry]);

  function reload() {
    setLoading(true);
    setChecked([]);
    setRetry((value) => value + 1);
  }
  function filter(key: keyof typeof filters, value: string | number) {
    setLoading(true);
    setChecked([]);
    setFilters((current) => ({ ...current, page: 0, [key]: value }));
  }
  function reset() {
    setLoading(true);
    setChecked([]);
    setFilters({
      classNo: 'all',
      lesson: 'all',
      status: 'all',
      search: '',
      sort: 'newest',
      page: 0,
    });
  }
  function start(action: AppAction, targets: AdminStudentApp[]) {
    setReason('');
    setConfirmation('');
    setActionError('');
    setPending({ action, entries: targets });
    if (action === 'edit')
      setEdit({
        title: targets[0].title,
        lesson: targets[0].lesson_no,
        url: targets[0].url,
      });
  }
  function showAudit(entry: Receipt) {
    setAudit([]);
    setAuditError('');
    setAuditLoading(true);
    setAuditEntry(entry);
  }
  async function submit() {
    if (!pending || busy) return;
    setBusy(true);
    setActionError('');
    setNotice('');
    try {
      const changed = await manageApps(
        pending.entries,
        pending.action,
        reason,
        pending.action === 'edit' ? edit : undefined,
      );
      setReceipts(
        pending.entries.map(({ id, student_name, class_no, student_no }) => ({
          id,
          student_name,
          class_no,
          student_no,
        })),
      );
      setNotice(
        `${changed}개 앱을 ${appActionLabels[pending.action]} 처리했습니다.`,
      );
      setPending(null);
      reload();
    } catch (failure) {
      setActionError(appManagementError(failure));
    } finally {
      setBusy(false);
    }
  }
  const reasonValid = reason.trim().length >= 3 && reason.trim().length <= 300;
  const confirmationValid =
    pending?.action !== 'delete' || confirmation.trim() === '완전 삭제';

  return (
    <section className="mt-7 space-y-5 text-base">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['조회 결과', result?.total],
          ['학생에게 표시', result?.visible],
          ['숨긴 앱', result?.hidden],
        ].map(([label, count]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black">
              {loading ? '…' : (count ?? '—')}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-4 rounded-3xl border bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black">학생 공유 앱</h2>
          <Button variant="outline" onClick={reload} disabled={busy}>
            <RefreshCw className={loading ? 'animate-spin' : ''} />
            새로고침
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label
            htmlFor="admin-app-search"
            className="sm:col-span-2 xl:col-span-2"
          >
            <span className="mb-2 block text-sm font-bold">
              학생·앱·주소 검색
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 size-5 text-slate-400" />
              <Input
                id="admin-app-search"
                className="h-11 pl-10 text-base"
                maxLength={100}
                placeholder="이름, 번호, 앱 이름 또는 링크"
                value={filters.search}
                onChange={(event) => filter('search', event.target.value)}
              />
            </div>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">학급</span>
            <select
              className={selectClass}
              value={filters.classNo}
              onChange={(event) => filter('classNo', event.target.value)}
            >
              <option value="all">관리 가능한 전체 학급</option>
              {result?.classes.map((no) => (
                <option key={no} value={no}>
                  {no}반
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">차시</span>
            <select
              className={selectClass}
              value={filters.lesson}
              onChange={(event) => filter('lesson', event.target.value)}
            >
              <option value="all">전체 차시</option>
              {[5, 6, 7, 8, 9, 10].map((no) => (
                <option key={no} value={no}>
                  {no}차시
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">표시 상태</span>
            <select
              className={selectClass}
              value={filters.status}
              onChange={(event) => filter('status', event.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="visible">학생에게 표시</option>
              <option value="hidden">숨김</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="w-full sm:w-48">
            <span className="mb-2 block text-sm font-bold">정렬</span>
            <select
              className={selectClass}
              value={filters.sort}
              onChange={(event) => filter('sort', event.target.value)}
            >
              <option value="newest">최근 변경순</option>
              <option value="oldest">오래된 순</option>
              <option value="student">학급·학생 번호순</option>
            </select>
          </label>
          <Button variant="ghost" onClick={reset} disabled={busy}>
            검색 조건 초기화
          </Button>
        </div>
        <p className="leading-7 text-slate-600">
          학생은 링크를 등록하고 열어볼 수 있습니다. 수정·숨김·복원·삭제는
          관리자만 처리할 수 있습니다.
        </p>
      </div>
      <output className="block font-bold text-teal-800" aria-live="polite">
        {notice}
      </output>
      {receipts.length > 0 && (
        <details className="rounded-2xl border bg-white p-4">
          <summary className="cursor-pointer font-bold">
            마지막 처리 앱 기록 ({receipts.length}개)
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {receipts.map((entry) => (
              <Button
                key={entry.id}
                variant="outline"
                onClick={() => showAudit(entry)}
              >
                <History />
                {entry.class_no}반 {entry.student_no}번 {entry.student_name}{' '}
                처리 기록
              </Button>
            ))}
          </div>
        </details>
      )}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-slate-50 p-4">
        <label
          htmlFor="admin-app-select-page"
          className="flex items-center gap-2 font-bold"
        >
          <Checkbox
            id="admin-app-select-page"
            aria-label="현재 페이지 전체 선택"
            checked={entries.length > 0 && selected.length === entries.length}
            disabled={!canManage || entries.length === 0}
            onCheckedChange={(value) =>
              setChecked(value ? entries.map((entry) => entry.id) : [])
            }
          />
          현재 페이지 선택
        </label>
        <span className="text-sm font-bold">{selected.length}개 선택</span>
        <Button
          variant="outline"
          disabled={!canManage || !selected.length}
          onClick={() => start('hide', selected)}
        >
          <EyeOff />
          선택 숨김
        </Button>
        <Button
          variant="outline"
          disabled={!canManage || !selected.length}
          onClick={() => start('restore', selected)}
        >
          <Eye />
          선택 복원
        </Button>
        <Button
          variant="outline"
          className="text-red-700"
          disabled={!canManage || !selected.length}
          onClick={() => start('delete', selected)}
        >
          <Trash2 />
          선택 완전 삭제
        </Button>
      </div>
      {loading ? (
        <output className="block rounded-3xl border bg-white p-6">
          앱을 불러오는 중…
        </output>
      ) : error ? (
        <div
          role="alert"
          className="rounded-3xl border border-red-200 bg-red-50 p-6"
        >
          <p>{error}</p>
          <Button className="mt-3" onClick={reload}>
            다시 불러오기
          </Button>
        </div>
      ) : !entries.length ? (
        <p className="rounded-3xl border border-dashed bg-white p-8">
          조건에 맞는 앱이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="min-w-0 rounded-3xl border bg-white p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  className="mt-1"
                  aria-label={`${entry.class_no}반 ${entry.student_no}번 ${entry.title} 선택`}
                  checked={checked.includes(entry.id)}
                  disabled={!canManage}
                  onCheckedChange={(value) =>
                    setChecked((current) =>
                      value
                        ? [...current, entry.id]
                        : current.filter((id) => id !== entry.id),
                    )
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-sm font-bold">
                    <span className="text-teal-700">
                      {entry.grade}학년 {entry.class_no}반 {entry.student_no}번
                      · {entry.student_name}
                    </span>
                    <span>{entry.lesson_no}차시</span>
                    <span
                      className={
                        entry.deleted_at ? 'text-amber-800' : 'text-slate-500'
                      }
                    >
                      {entry.deleted_at ? '숨김' : '학생에게 표시'}
                    </span>
                  </div>
                  <h3 className="mt-2 break-words text-xl font-black">
                    {entry.title}
                  </h3>
                  <p className="mt-2 break-all text-slate-600">{entry.url}</p>
                  <p className="mt-2 break-all text-sm text-slate-500">
                    {entry.account_email} · 변경 {date(entry.updated_at)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={/^https?:\/\//i.test(entry.url) ? entry.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  <ExternalLink />앱 열기
                </a>
                <Button
                  variant="outline"
                  disabled={!canManage}
                  onClick={() => start('edit', [entry])}
                >
                  <Pencil />
                  수정
                </Button>
                <Button
                  variant="outline"
                  disabled={!canManage}
                  onClick={() =>
                    start(entry.deleted_at ? 'restore' : 'hide', [entry])
                  }
                >
                  {entry.deleted_at ? <Eye /> : <EyeOff />}
                  {entry.deleted_at ? '복원' : '숨김'}
                </Button>
                <Button
                  variant="outline"
                  className="text-red-700"
                  disabled={!canManage}
                  onClick={() => start('delete', [entry])}
                >
                  <Trash2 />
                  완전 삭제
                </Button>
                <Button variant="ghost" onClick={() => showAudit(entry)}>
                  <History />
                  처리 기록
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">
          {filters.page + 1} / {pages}페이지 · 최대 50개씩 표시
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={loading || busy || filters.page === 0}
            onClick={() => filter('page', filters.page - 1)}
          >
            이전
          </Button>
          <Button
            variant="outline"
            disabled={loading || busy || filters.page + 1 >= pages}
            onClick={() => filter('page', filters.page + 1)}
          >
            다음
          </Button>
        </div>
      </div>

      <AlertDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open && !busy) setPending(null);
        }}
      >
        <AlertDialogContent className="max-h-[90dvh] overflow-y-auto text-base sm:max-w-xl">
          <AlertDialogTitle>
            앱 {pending ? appActionLabels[pending.action] : ''} ·{' '}
            {pending?.entries.length ?? 0}개
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-7">
            {pending?.action === 'delete'
              ? '보관함에서 공유 링크 기록을 영구 삭제하며 복원할 수 없습니다. 외부 서비스의 앱 자체와 학생의 수업 기록은 유지됩니다.'
              : pending?.action === 'hide'
                ? '학생의 보관함에서 숨깁니다. 관리자 화면에서 복원할 수 있습니다.'
                : pending?.action === 'restore'
                  ? '숨긴 앱을 학생의 보관함에 다시 표시합니다.'
                  : '앱 이름, 차시, 공유 링크를 수정합니다. 학생의 수업 기록은 유지됩니다.'}
          </AlertDialogDescription>
          <ul className="max-h-40 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
            {pending?.entries.map((entry) => (
              <li key={entry.id} className="break-words">
                {entry.class_no}반 {entry.student_no}번 {entry.student_name} ·{' '}
                {entry.title}
              </li>
            ))}
          </ul>
          {pending?.action === 'edit' && (
            <div className="space-y-3">
              <label htmlFor="admin-app-title" className="block font-bold">
                앱 이름
                <Input
                  id="admin-app-title"
                  className="mt-2 text-base"
                  value={edit.title}
                  disabled={busy}
                  maxLength={80}
                  onChange={(event) =>
                    setEdit((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block font-bold">
                만든 차시
                <select
                  className={`${selectClass} mt-2`}
                  value={edit.lesson}
                  disabled={busy}
                  onChange={(event) =>
                    setEdit((current) => ({
                      ...current,
                      lesson: Number(event.target.value),
                    }))
                  }
                >
                  {[5, 6, 7, 8, 9, 10].map((no) => (
                    <option key={no} value={no}>
                      {no}차시
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="admin-app-url" className="block font-bold">
                공유 링크
                <Input
                  id="admin-app-url"
                  className="mt-2 text-base"
                  type="url"
                  value={edit.url}
                  disabled={busy}
                  maxLength={2000}
                  onChange={(event) =>
                    setEdit((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          )}
          <label className="block font-bold">
            처리 사유
            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border p-3 text-base"
              value={reason}
              disabled={busy}
              maxLength={300}
              placeholder="수정 또는 삭제가 필요한 이유를 3자 이상 입력"
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          {pending?.action === 'delete' && (
            <label
              htmlFor="admin-app-confirm"
              className="block font-bold text-red-700"
            >
              확인 문구: 완전 삭제
              <Input
                id="admin-app-confirm"
                className="mt-2 text-base"
                value={confirmation}
                disabled={busy}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="완전 삭제"
              />
            </label>
          )}
          {actionError && (
            <p role="alert" className="text-red-700">
              {actionError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialogCancel disabled={busy}>취소</AlertDialogCancel>
            <Button
              className={
                pending?.action === 'delete'
                  ? 'bg-red-700 text-white hover:bg-red-800'
                  : ''
              }
              disabled={busy || !reasonValid || !confirmationValid}
              onClick={() => void submit()}
            >
              {busy
                ? '처리 중…'
                : pending
                  ? `${appActionLabels[pending.action]} 실행`
                  : '실행'}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={Boolean(auditEntry)}
        onOpenChange={(open) => {
          if (!open) setAuditEntry(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto text-base sm:max-w-xl">
          <DialogTitle>앱 처리 기록</DialogTitle>
          <DialogDescription className="text-base">
            {auditEntry?.class_no}반 {auditEntry?.student_no}번{' '}
            {auditEntry?.student_name} · 최근 100개 기록
          </DialogDescription>
          {auditLoading ? (
            <output>기록을 불러오는 중…</output>
          ) : auditError ? (
            <p role="alert" className="text-red-700">
              {auditError}
            </p>
          ) : !audit.length ? (
            <p>처리 기록이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {audit.map((item) => (
                <li key={item.id} className="rounded-xl border p-4">
                  <p className="font-bold">
                    {appActionLabels[item.action]} · {item.actor_name}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words">
                    {item.reason}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {date(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
