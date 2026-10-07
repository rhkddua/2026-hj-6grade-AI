'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, History, RefreshCw, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  queryAdminBoard,
  loadBoardAudit,
  manageBoard,
  type AdminBoardEntry,
  type AdminBoardResult,
  type BoardAudit,
} from '@/lib/admin-reflection-board';
import {
  BOARD_PAGE_SIZE,
  boardActionLabels,
  boardEntryKey,
  boardManagementError,
  type BoardAction,
  type BoardSort,
} from '@/lib/admin-board-management';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
const selectClass =
  'h-10 min-w-0 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-50';
type PendingAction = { action: BoardAction; entries: AdminBoardEntry[] };

export function AdminReflectionBoard() {
  const [lesson, setLesson] = useState('all');
  const [status, setStatus] = useState('all');
  const [classNo, setClassNo] = useState('all');
  const [sort, setSort] = useState<BoardSort>('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<AdminBoardResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [reason, setReason] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastProcessed, setLastProcessed] = useState<AdminBoardEntry[]>([]);
  const [auditEntry, setAuditEntry] = useState<AdminBoardEntry | null>(null);
  const [audit, setAudit] = useState<BoardAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const entries = result?.entries ?? [];
  const selectedEntries = entries.filter((entry) =>
    checked.includes(boardEntryKey(entry)),
  );
  const pageCount = Math.max(
    1,
    Math.ceil((result?.total ?? 0) / BOARD_PAGE_SIZE),
  );
  const canManage = !loading && !error && !busy;

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void queryAdminBoard({ lesson, status, search, classNo, sort, page })
        .then((data) => {
          if (!active) return;
          const lastPage = Math.min(
            200,
            Math.max(0, Math.ceil(data.total / BOARD_PAGE_SIZE) - 1),
          );
          if (page > lastPage) {
            setPage(lastPage);
            return;
          }
          setResult(data);
          setError('');
          setLoading(false);
        })
        .catch((failure) => {
          if (!active) return;
          setResult(null);
          setError(boardManagementError(failure));
          setLoading(false);
        });
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [lesson, status, search, classNo, sort, page, retry]);

  useEffect(() => {
    if (!auditEntry) return;
    let active = true;
    void loadBoardAudit(auditEntry)
      .then((data) => {
        if (active) setAudit(data);
      })
      .catch(() => {
        if (active)
          setAuditError(
            '처리 기록을 불러오지 못했습니다. 닫은 뒤 다시 시도해 주세요.',
          );
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
    setError('');
    setChecked([]);
    setPending(null);
    setRetry((value) => value + 1);
  }
  function changeFilter(change: () => void) {
    change();
    setRetry((value) => value + 1);
    setPage(0);
    setLoading(true);
    setError('');
    setChecked([]);
    setNotice('');
  }
  function goToPage(nextPage: number) {
    setPage(nextPage);
    setLoading(true);
    setError('');
    setChecked([]);
  }
  function openAction(action: BoardAction, targets: AdminBoardEntry[]) {
    if (!canManage || targets.length === 0) return;
    const actionable = targets.filter(
      (entry) =>
        action === 'delete' || entry.is_hidden === (action === 'restore'),
    );
    if (!actionable.length) return;
    setPending({ action, entries: actionable });
    setReason('');
    setDeleteConfirmation('');
    setActionError('');
    setNotice('');
  }
  function openAudit(entry: AdminBoardEntry) {
    setAuditEntry({ ...entry });
    setAudit([]);
    setAuditError('');
    setAuditLoading(true);
  }
  async function submitAction() {
    if (
      !pending ||
      busy ||
      reason.trim().length < 3 ||
      reason.trim().length > 300 ||
      (pending.action === 'delete' && deleteConfirmation.trim() !== '완전 삭제')
    )
      return;
    setBusy(true);
    setActionError('');
    try {
      const count = await manageBoard(pending.entries, pending.action, reason);
      setNotice(
        `${count}개 게시글을 ${boardActionLabels[pending.action]}했습니다.${pending.action === 'delete' ? ' 게시판에서 제거되었으며 복구할 수 없습니다.' : ''}`,
      );
      // Receipts retain only identity for audit lookup, never the deleted body.
      setLastProcessed(
        pending.entries.map((entry) => ({ ...entry, reflection: '' })),
      );
      setPending(null);
      setChecked([]);
      setResult(null);
      setLoading(true);
      setRetry((value) => value + 1);
    } catch (failure) {
      setActionError(boardManagementError(failure));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-7 space-y-4" aria-label="게시판 관리">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">
          담당 범위의 글을 관리합니다. 작성 계정은 관리자에게만 보이며 학생
          게시판은 익명을 유지합니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="sm:col-span-2" htmlFor="admin-board-search">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Search className="size-4" />
              게시글 검색
            </span>
            <Input
              id="admin-board-search"
              disabled={busy}
              maxLength={100}
              className="h-10"
              placeholder="글 내용, 학생 이름·번호, 계정 검색"
              value={search}
              onChange={(e) => changeFilter(() => setSearch(e.target.value))}
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">학급</span>
            <select
              disabled={busy}
              className={selectClass}
              value={classNo}
              onChange={(e) => changeFilter(() => setClassNo(e.target.value))}
            >
              <option value="all">전체 담당 학급</option>
              {(
                result?.classes ?? (classNo !== 'all' ? [Number(classNo)] : [])
              ).map((value) => (
                <option key={value} value={value}>
                  6학년 {value}반
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">차시</span>
            <select
              disabled={busy}
              className={selectClass}
              value={lesson}
              onChange={(e) => changeFilter(() => setLesson(e.target.value))}
            >
              <option value="all">전체 차시</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}차시
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">공개 상태</span>
            <select
              disabled={busy}
              className={selectClass}
              value={status}
              onChange={(e) => changeFilter(() => setStatus(e.target.value))}
            >
              <option value="all">전체 상태</option>
              <option value="visible">공개</option>
              <option value="hidden">숨김</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">정렬</span>
            <select
              disabled={busy}
              className={selectClass}
              value={sort}
              onChange={(e) =>
                changeFilter(() => setSort(e.target.value as BoardSort))
              }
            >
              <option value="newest">최근 게시 순</option>
              <option value="oldest">오래된 게시 순</option>
              <option value="student">학급·학생 번호 순</option>
            </select>
          </label>
          <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
            <Button
              className="h-10"
              variant="outline"
              disabled={loading || busy}
              onClick={reload}
            >
              <RefreshCw />
              새로고침
            </Button>
            <Button
              className="h-10"
              variant="ghost"
              disabled={busy}
              onClick={() =>
                changeFilter(() => {
                  setSearch('');
                  setLesson('all');
                  setStatus('all');
                  setClassNo('all');
                  setSort('newest');
                })
              }
            >
              필터 초기화
            </Button>
          </div>
        </div>
        {result && !loading && !error && (
          <output className="mt-4 block text-sm text-slate-600">
            학급·차시·검색 조건의 글 {result.visible + result.hidden}개 · 공개{' '}
            {result.visible}개 · 숨김 {result.hidden}개
          </output>
        )}
      </div>
      {notice && (
        <output className="block rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <p>{notice}</p>
          {lastProcessed.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-bold">
                방금 처리한 글의 기록 확인 ({lastProcessed.length}개)
              </summary>
              <div className="mt-2 flex flex-wrap gap-2">
                {lastProcessed.map((entry) => (
                  <Button
                    key={boardEntryKey(entry)}
                    variant="outline"
                    onClick={() => openAudit(entry)}
                  >
                    {entry.student_name || '학생'} · {entry.lesson_no}차시 기록
                  </Button>
                ))}
              </div>
            </details>
          )}
        </output>
      )}
      {error && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-red-800">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            disabled={loading || busy}
            onClick={reload}
          >
            다시 불러오기
          </Button>
        </div>
      )}
      {!loading && !error && entries.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <label
            htmlFor="admin-board-select-page"
            className="flex cursor-pointer items-center gap-3 text-sm font-bold"
          >
            <Checkbox
              id="admin-board-select-page"
              disabled={!canManage}
              checked={selectedEntries.length === entries.length}
              indeterminate={
                selectedEntries.length > 0 &&
                selectedEntries.length < entries.length
              }
              onCheckedChange={(value) =>
                setChecked(value ? entries.map(boardEntryKey) : [])
              }
            />
            현재 페이지 전체 선택
          </label>
          <span className="text-sm text-slate-600">
            {selectedEntries.length}개 선택
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={
                !canManage || !selectedEntries.some((entry) => !entry.is_hidden)
              }
              onClick={() => openAction('hide', selectedEntries)}
            >
              <EyeOff />
              선택 숨김
            </Button>
            <Button
              variant="outline"
              disabled={
                !canManage || !selectedEntries.some((entry) => entry.is_hidden)
              }
              onClick={() => openAction('restore', selectedEntries)}
            >
              <Eye />
              선택 공개 복원
            </Button>
            <Button
              variant="destructive"
              disabled={!canManage || !selectedEntries.length}
              onClick={() => openAction('delete', selectedEntries)}
            >
              <Trash2 />
              선택 완전 삭제
            </Button>
          </div>
          <p className="w-full text-sm text-slate-500">
            선택은 페이지 이동·필터 변경·새로고침 시 해제됩니다. 숨김·복원은
            상태를 바꿀 글만 처리합니다.
          </p>
        </div>
      )}
      {loading ? (
        <output className="block rounded-3xl bg-white p-8 text-center">
          게시글을 불러오는 중…
        </output>
      ) : !error && entries.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center">
          <p>조건에 맞는 게시글이 없습니다.</p>
          <p className="mt-2 text-sm text-slate-500">
            검색어와 학급·차시·공개 상태를 확인해 주세요.
          </p>
        </div>
      ) : (
        !error && (
          <div className="grid gap-4 xl:grid-cols-2">
            {entries.map((entry) => (
              <article
                key={boardEntryKey(entry)}
                className={`min-w-0 rounded-3xl border bg-white p-5 shadow-sm ${checked.includes(boardEntryKey(entry)) ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <Checkbox
                      className="mt-1"
                      aria-label={`${entry.student_name || '학생'} ${entry.lesson_no}차시 글 선택`}
                      disabled={!canManage}
                      checked={checked.includes(boardEntryKey(entry))}
                      onCheckedChange={(value) =>
                        setChecked((previous) =>
                          value
                            ? [
                                ...previous.filter(
                                  (key) => key !== boardEntryKey(entry),
                                ),
                                boardEntryKey(entry),
                              ]
                            : previous.filter(
                                (key) => key !== boardEntryKey(entry),
                              ),
                        )
                      }
                    />
                    <div className="min-w-0">
                      <h2 className="break-words font-bold">
                        {entry.student_name || '학생 프로필 없음'}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {entry.grade
                          ? `${entry.grade}학년 ${entry.class_no}반 ${entry.student_no}번`
                          : '학급 정보 없음'}{' '}
                        · {entry.lesson_no}차시
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${entry.is_hidden ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}
                  >
                    {entry.is_hidden ? '숨김' : '공개'}
                  </span>
                </div>
                <p className="mt-3 break-all text-sm text-slate-600">
                  <strong>작성 계정:</strong>{' '}
                  {entry.account_email || entry.user_id}
                </p>
                <p className="mt-3 whitespace-pre-wrap break-words text-base leading-7">
                  {entry.reflection}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  최근 게시: {formatDate(entry.updated_at)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={!canManage}
                    onClick={() =>
                      openAction(entry.is_hidden ? 'restore' : 'hide', [entry])
                    }
                  >
                    {entry.is_hidden ? <Eye /> : <EyeOff />}
                    {entry.is_hidden ? '공개 복원' : '숨김'}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => openAudit(entry)}
                  >
                    <History />
                    처리 기록
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={!canManage}
                    onClick={() => openAction('delete', [entry])}
                  >
                    <Trash2 />
                    완전 삭제
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )
      )}
      {!loading && !error && result && (
        <nav
          aria-label="게시글 페이지"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <Button
            variant="outline"
            disabled={page === 0 || busy}
            onClick={() => goToPage(page - 1)}
          >
            이전 페이지
          </Button>
          <p className="text-sm text-slate-600">
            {page + 1} / {pageCount}페이지 · {result.total}개 중{' '}
            {entries.length ? page * BOARD_PAGE_SIZE + 1 : 0}–
            {page * BOARD_PAGE_SIZE + entries.length}개
          </p>
          <Button
            variant="outline"
            disabled={
              (page + 1) * BOARD_PAGE_SIZE >= result.total ||
              page >= 200 ||
              busy
            }
            onClick={() => goToPage(page + 1)}
          >
            다음 페이지
          </Button>
        </nav>
      )}

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setPending(null);
        }}
      >
        <AlertDialogContent className="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
          <AlertDialogTitle className="text-lg font-bold">
            게시글 {pending?.entries.length ?? 0}개{' '}
            {pending ? boardActionLabels[pending.action] : ''}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-7">
            {pending?.action === 'delete'
              ? '선택한 글의 본문을 게시판에서 완전히 삭제하며 복구할 수 없습니다. 수업 진도와 수업에 저장된 성찰은 유지됩니다. 처리 사유와 관리자 기록은 남습니다.'
              : '숨긴 글은 학생 게시판에서 보이지 않으며 다시 공개할 수 있습니다. 처리 사유는 관리자 기록에 남습니다.'}
          </AlertDialogDescription>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitAction();
            }}
            className="space-y-4"
          >
            <ul
              aria-label="처리 대상"
              className="max-h-32 space-y-1 overflow-y-auto rounded-xl bg-slate-50 p-3 text-sm"
            >
              {pending?.entries.map((entry) => (
                <li key={boardEntryKey(entry)}>
                  {entry.grade
                    ? `${entry.grade}학년 ${entry.class_no}반 ${entry.student_no}번 · `
                    : ''}
                  {entry.student_name || '학생'} · {entry.lesson_no}차시
                </li>
              ))}
            </ul>
            {pending?.entries.length === 1 && (
              <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border p-3 text-base leading-7">
                {pending.entries[0].reflection}
              </p>
            )}
            <label className="block text-sm font-bold">
              처리 사유 (3~300자)
              <textarea
                required
                minLength={3}
                maxLength={300}
                disabled={busy}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 min-h-24 w-full rounded-xl border p-3 text-base font-normal"
                placeholder="처리 사유를 입력해 주세요"
              />
            </label>
            {pending?.action === 'delete' && (
              <label
                htmlFor="admin-board-delete-confirmation"
                className="block text-sm font-bold text-red-800"
              >
                삭제 확인: 아래에 ‘완전 삭제’를 입력하세요
                <Input
                  id="admin-board-delete-confirmation"
                  className="mt-2 h-10 font-normal"
                  autoComplete="off"
                  disabled={busy}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="완전 삭제"
                />
              </label>
            )}
            {actionError && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-base text-red-800"
              >
                <p>{actionError}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  disabled={busy}
                  onClick={reload}
                >
                  목록 새로고침
                </Button>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={busy}>
                취소
              </AlertDialogCancel>
              <Button
                type="submit"
                className="h-10"
                variant={
                  pending?.action === 'delete' ? 'destructive' : 'default'
                }
                disabled={
                  busy ||
                  reason.trim().length < 3 ||
                  (pending?.action === 'delete' &&
                    deleteConfirmation.trim() !== '완전 삭제')
                }
              >
                {busy
                  ? '처리 중…'
                  : `${pending?.entries.length ?? 0}개 ${pending ? boardActionLabels[pending.action] : ''} 실행`}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={auditEntry !== null}
        onOpenChange={(open) => {
          if (!open) setAuditEntry(null);
        }}
      >
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
          showCloseButton={false}
        >
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-lg font-bold">
              {auditEntry?.student_name || '학생'} · {auditEntry?.lesson_no}차시
              처리 기록
            </DialogTitle>
            <Button variant="outline" onClick={() => setAuditEntry(null)}>
              닫기
            </Button>
          </div>
          <DialogDescription>
            최근 처리 50개를 표시합니다. 완전 삭제 후에도 처리 기록은
            유지됩니다.
          </DialogDescription>
          {auditLoading ? (
            <output className="block">기록을 불러오는 중…</output>
          ) : auditError ? (
            <p role="alert" className="text-red-700">
              {auditError}
            </p>
          ) : audit.length === 0 ? (
            <p className="text-slate-600">처리 기록이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {audit.map((item) => (
                <li key={item.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-bold">
                    {boardActionLabels[item.action]} · {item.actor_name} ·{' '}
                    {formatDate(item.created_at)}
                  </p>
                  <p className="mt-1 break-words text-base">{item.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
