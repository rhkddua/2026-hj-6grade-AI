import { getStudentBadges } from './student-badge';
import { useStudentCourseProgress } from './use-student-course-progress';

export function useStudentBadge(userId: string | undefined) {
  const course = useStudentCourseProgress(userId);
  return {
    ...getStudentBadges(course.lessons),
    loading: course.loading,
    refreshing: course.refreshing,
    error: course.error,
    retry: course.retry,
  };
}
