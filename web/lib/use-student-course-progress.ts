import { useEffect, useState } from 'react';

import { loadStudentCourseProgress } from './lesson-progress';
import { summarizeCourseProgress, type CourseLessonRecord } from './student-course-progress';

export function useStudentCourseProgress(userId: string | undefined) {
  const [state, setState] = useState<{
    userId?: string;
    records: CourseLessonRecord[];
    loading: boolean;
    error: boolean;
    ready: boolean;
  }>({ records: [], loading: true, error: false, ready: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    let revision = 0;
    async function refresh() {
      const request = ++revision;
      if (!active) return;
      setState(previous => previous.userId === userId
        ? { ...previous, loading: true }
        : { userId, records: [], loading: true, error: false, ready: false });
      try {
        const records = await loadStudentCourseProgress();
        if (active && request === revision) {
          setState({ userId, records, loading: false, error: false, ready: true });
        }
      } catch {
        if (active && request === revision) {
          setState({ userId, records: [], loading: false, error: true, ready: true });
        }
      }
    }
    // Also refresh when returning to a cached home page after a lesson.
    void Promise.resolve().then(refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      active = false;
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, [userId, attempt]);

  const currentUser = state.userId === userId && Boolean(userId);
  return {
    ...summarizeCourseProgress(currentUser ? state.records : []),
    loading: !currentUser || (!state.ready && state.loading),
    error: currentUser && state.error,
    retry: () => setAttempt(value => value + 1),
  };
}
