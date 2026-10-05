import { useEffect, useState } from 'react';
import { loadLessonProgress, type LessonProgress } from './lesson-progress';
import { getStudentBadge } from './student-badge';

export function useStudentBadge(userId: string | undefined) {
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!userId) return;
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError(false);
      try {
        const saved = await loadLessonProgress(1);
        if (active) setProgress(saved);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [userId, attempt]);
  return { ...getStudentBadge(progress), loading, error, retry: () => setAttempt(value => value + 1) };
}
