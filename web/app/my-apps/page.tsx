'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Rocket } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudentSession } from '@/lib/student-auth';
import {
  loadStudentApps,
  saveStudentApp,
  type StudentApp,
} from '@/lib/student-apps';

export default function MyAppsPage() {
  const { user, loading: authLoading } = useStudentSession();
  const [apps, setApps] = useState<StudentApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [lesson, setLesson] = useState(5);
  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setApps(await loadStudentApps());
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (user) void Promise.resolve().then(refresh);
  }, [user, refresh]);
  function resetForm() {
    setTitle('');
    setUrl('');
    setLesson(5);
  }
  async function save(event: { preventDefault(): void }) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await saveStudentApp(title, lesson, url);
      resetForm();
      setMessage('앱을 저장했어요.');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했어요.');
    } finally {
      setBusy(false);
    }
  }
  if (authLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <output>로그인을 확인하는 중…</output>
      </div>
    );
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          {/* oxlint-disable-next-line next/no-html-link-for-pages */}
          <a href="/" className={buttonVariants({ variant: 'ghost' })}>
            <ArrowLeft />
            수업 홈
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-7 sm:px-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black">
            <Rocket />
            나의 앱 보관함
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            5~10차시에서 만든 앱의 공유 링크를 보관해요. 저장한 앱은 나와 담당
            선생님이 볼 수 있어요. 등록한 링크는 직접 수정하거나 삭제할 수
            없어요. 변경이 필요하면 선생님에게 요청하세요.
          </p>
        </div>
        <form
          onSubmit={(event) => void save(event)}
          className="space-y-4 rounded-3xl border bg-card p-5 sm:p-6"
        >
          <h2 className="text-xl font-black">새 앱 등록하기</h2>
          <fieldset
            disabled={busy || loading || Boolean(loadError)}
            className="space-y-4 disabled:opacity-60"
          >
            <div>
              <label htmlFor="app-title" className="font-bold">
                앱 이름
              </label>
              <Input
                id="app-title"
                className="mt-2 text-base"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                required
                placeholder="예: 준비물 체크 앱"
              />
            </div>
            <div>
              <label htmlFor="app-lesson" className="font-bold">
                만든 차시
              </label>
              <select
                id="app-lesson"
                className="mt-2 block min-h-11 rounded-xl border bg-background px-3 text-base"
                value={lesson}
                onChange={(e) => setLesson(Number(e.target.value))}
              >
                {[5, 6, 7, 8, 9, 10].map((no) => (
                  <option key={no} value={no}>
                    {no}차시
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="app-url" className="font-bold">
                공유 링크
              </label>
              <Input
                id="app-url"
                className="mt-2 text-base"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                maxLength={2000}
                required
                placeholder="https://…"
              />
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                앱에서 복사한 공유 링크를 붙여 넣으세요. 이름·연락처·비밀번호를
                넣지 않아요.
              </p>
            </div>
            <Button type="submit">{busy ? '저장 중…' : '앱 저장'}</Button>
          </fieldset>
        </form>
        {error && (
          <p role="alert" className="font-bold text-red-700">
            {error}
          </p>
        )}
        <output className="font-bold text-teal-800">{message}</output>
        <section className="space-y-4">
          <h2 className="text-xl font-black">저장한 앱</h2>
          {loading ? (
            <output>앱을 불러오는 중…</output>
          ) : loadError ? (
            <div role="alert" className="rounded-2xl border p-5">
              <p>{loadError}</p>
              <Button className="mt-3" onClick={() => void refresh()}>
                다시 불러오기
              </Button>
            </div>
          ) : apps.length === 0 ? (
            <p className="rounded-3xl border border-dashed p-6">
              아직 저장한 앱이 없어요. 위에서 첫 앱을 등록해 보세요.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {apps.map((app) => (
                <article
                  key={app.id}
                  className="space-y-4 rounded-3xl border bg-card p-5"
                >
                  <p className="text-sm font-bold text-teal-700">
                    {app.lesson_no}차시
                  </p>
                  <h3 className="break-words text-xl font-black">
                    {app.title}
                  </h3>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: 'default' })}
                  >
                    앱 열기
                    <ExternalLink />
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
