'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadAdminBoard, loadBoardAudit, moderateBoard, type AdminBoardEntry, type BoardAudit } from '@/lib/admin-reflection-board';

const formatDate = (value: string) => new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Seoul',
}).format(new Date(value));

export function AdminReflectionBoard() {
  const [lesson, setLesson] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [retry, setRetry] = useState(0);
  const [entries, setEntries] = useState<AdminBoardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<AdminBoardEntry | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [auditEntry, setAuditEntry] = useState<AdminBoardEntry | null>(null);
  const [audit, setAudit] = useState<BoardAudit[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError('');
      void loadAdminBoard(lesson, status, search, page).then((data) => {
        if (active) setEntries(data);
      }).catch(() => {
        if (active) {
          setEntries([]);
          setError('게시글을 불러오지 못했습니다. 관리자 권한과 연결 상태를 확인한 뒤 다시 시도해 주세요.');
        }
      }).finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; window.clearTimeout(timer); };
  }, [lesson, status, search, page, retry]);

  useEffect(() => {
    if (!auditEntry) return;
    let active = true;
    void loadBoardAudit(auditEntry).then((data) => { if (active) setAudit(data); })
      .catch(() => { if (active) setAuditError('처리 기록을 불러오지 못했습니다.'); })
      .finally(() => { if (active) setAuditLoading(false); });
    return () => { active = false; };
  }, [auditEntry]);

  async function submitModeration() {
    if (!selected || busy || reason.trim().length < 3) return;
    setBusy(true);
    setError('');
    try {
      await moderateBoard(selected, reason);
      setNotice(selected.is_hidden ? '게시글을 다시 공개했습니다.' : '게시글을 숨겼습니다. 학생 게시판에서 보이지 않습니다.');
      setSelected(null);
      setReason('');
      setLoading(true);
      setRetry((value) => value + 1);
    } catch {
      setError('처리하지 못했습니다. 권한이 없거나 글이 변경되었을 수 있습니다. 새로고침 후 다시 시도해 주세요.');
    } finally { setBusy(false); }
  }

  function changeFilter(change: () => void) {
    change(); setPage(0); setLoading(true); setSelected(null); setAuditEntry(null); setNotice('');
  }

  return <section className="mt-7 space-y-4">
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm leading-6 text-slate-600">작성 계정은 관리자에게만 표시됩니다. 학생 게시판은 익명을 유지합니다.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_150px_150px_auto]">
        <Input aria-label="게시글 검색" maxLength={100} placeholder="학생 이름, 번호 또는 계정 검색" value={search} onChange={(e) => changeFilter(() => setSearch(e.target.value))} />
        <select aria-label="게시글 차시 선택" className="h-10 rounded-lg border px-3 text-sm" value={lesson} onChange={(e) => changeFilter(() => setLesson(e.target.value))}><option value="all">전체 차시</option>{Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}차시</option>)}</select>
        <select aria-label="게시글 상태 선택" className="h-10 rounded-lg border px-3 text-sm" value={status} onChange={(e) => changeFilter(() => setStatus(e.target.value))}><option value="all">전체 상태</option><option value="visible">공개</option><option value="hidden">숨김</option></select>
        <Button variant="outline" disabled={loading || busy} onClick={() => { setLoading(true); setRetry((value) => value + 1); }}>게시글 새로고침</Button>
      </div>
    </div>
    {notice && <output className="block rounded-2xl bg-emerald-50 p-4 text-emerald-800">{notice}</output>}
    {error && <div role="alert" className="rounded-2xl bg-red-50 p-4 text-red-800"><p>{error}</p><Button variant="outline" className="mt-3" disabled={loading || busy} onClick={() => {setLoading(true); setRetry((v) => v + 1);}}>다시 불러오기</Button></div>}
    {selected && <form onSubmit={(event) => {event.preventDefault(); void submitModeration();}} className="rounded-3xl border border-orange-200 bg-white p-5">
      <h2 className="font-bold">{selected.student_name} · {selected.lesson_no}차시 {selected.is_hidden ? '다시 공개' : '숨김'} 처리</h2>
      <p className="mt-2 text-sm text-slate-600">숨긴 글은 학생에게 보이지 않으며 다시 공개할 수 있습니다. 처리 사유는 관리자 기록에 남습니다.</p>
      <label className="mt-4 block text-sm font-bold" htmlFor="moderation-reason">처리 사유 (3~300자)</label>
      <textarea id="moderation-reason" required minLength={3} maxLength={300} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border p-3 text-base" />
      <div className="mt-3 flex gap-2"><Button type="submit" disabled={busy || reason.trim().length < 3}>{busy ? '처리 중…' : selected.is_hidden ? '다시 공개' : '게시글 숨기기'}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => {setSelected(null); setReason('');}}>취소</Button></div>
    </form>}
    {loading ? <output className="block rounded-3xl bg-white p-8 text-center">게시글을 불러오는 중…</output> : !error && entries.length === 0 ? <p className="rounded-3xl bg-white p-8 text-center">조건에 맞는 게시글이 없습니다.</p> : !error && <div className="grid gap-4 xl:grid-cols-2">{entries.slice(0, 50).map((entry) => <article key={`${entry.user_id}-${entry.lesson_no}`} className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-bold">{entry.student_name || '학생 프로필 없음'}</h2><p className="mt-1 text-sm text-slate-600">{entry.grade ? `${entry.grade}학년 ${entry.class_no}반 ${entry.student_no}번` : '학급 정보 없음'} · {entry.lesson_no}차시</p></div><span className={`shrink-0 rounded-lg px-3 py-1 text-sm font-bold ${entry.is_hidden ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>{entry.is_hidden ? '숨김' : '공개'}</span></div>
      <p className="mt-3 break-all text-sm text-slate-700"><strong>작성 계정:</strong> {entry.account_email || entry.user_id}</p>
      <p className="mt-3 whitespace-pre-wrap break-words text-base leading-7">{entry.reflection}</p>
      <p className="mt-3 text-sm text-slate-500">최근 게시: {formatDate(entry.updated_at)}</p>
      <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" disabled={busy} onClick={() => {setSelected(entry); setReason(''); setNotice('');}}>{entry.is_hidden ? '공개로 복원' : '숨김 처리'}</Button><Button variant="ghost" disabled={busy} onClick={() => {setAudit([]); setAuditError(''); setAuditLoading(true); setAuditEntry({ ...entry });}}>처리 기록</Button></div>
    </article>)}</div>}
    {auditEntry && <aside className="rounded-3xl border bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">{auditEntry.student_name} · {auditEntry.lesson_no}차시 처리 기록</h2><Button variant="outline" onClick={() => setAuditEntry(null)}>기록 닫기</Button></div>{auditLoading ? <output className="block mt-3">기록을 불러오는 중…</output> : auditError ? <p role="alert" className="mt-3 text-red-700">{auditError}</p> : audit.length === 0 ? <p className="mt-3 text-slate-600">처리 기록이 없습니다.</p> : <ul className="mt-4 space-y-3">{audit.map((item) => <li key={item.id} className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-bold">{item.action === 'hide' ? '숨김' : '공개 복원'} · {item.actor_name} · {formatDate(item.created_at)}</p><p className="mt-1 break-words text-base">{item.reason}</p></li>)}</ul>}</aside>}
    {!loading && !error && <div className="flex items-center justify-between gap-3"><Button variant="outline" disabled={page === 0 || busy} onClick={() => {setLoading(true); setPage((v) => v - 1);}}>이전 페이지</Button><span className="text-sm">{page + 1}페이지 · 최대 50개</span><Button variant="outline" disabled={entries.length <= 50 || page >= 200 || busy} onClick={() => {setLoading(true); setPage((v) => v + 1);}}>다음 페이지</Button></div>}
  </section>;
}
