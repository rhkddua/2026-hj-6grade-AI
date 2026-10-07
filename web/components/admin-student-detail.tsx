'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { type AdminStudent } from '@/lib/admin-dashboard';
import {
  loadAdminStudentDetail,
  type StudentLessonDetail,
} from '@/lib/admin-student-detail';

const date = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(value));
const reflectionLabels = {
  visible: '게시판 성찰 · 공개',
  hidden: '게시판 성찰 · 숨김',
  draft: '미공유 성찰',
  deleted: '게시글 완전 삭제됨',
  none: '성찰 없음',
};

export function AdminStudentDetail({
  student,
  onClose,
}: {
  student: AdminStudent;
  onClose: () => void;
}) {
  const [items, setItems] = useState<StudentLessonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    void loadAdminStudentDetail(student.userId)
      .then((data) => {
        if (active) {
          setItems(data);
          setError('');
          setLoading(false);
        }
      })
      .catch((failure) => {
        if (active) {
          setItems([]);
          setError(
            failure instanceof Error
              ? failure.message
              : '상세 기록을 불러오지 못했습니다.',
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [student.userId, retry]);

  function refresh() {
    setItems([]);
    setError('');
    setLoading(true);
    setRetry((value) => value + 1);
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[88dvh] overflow-y-auto rounded-3xl bg-white p-6 text-base text-slate-950 sm:max-w-2xl sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-teal-100 text-teal-800">
              {student.grade}학년 {student.classNo}반 {student.studentNo}번
            </Badge>
            <DialogTitle className="mt-3 text-2xl font-black">
              {student.name} 학생
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              차시별 학습 상태와 현재 게시 상태를 확인합니다. 완전 삭제한
              게시글의 본문은 표시하지 않습니다.
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={loading} onClick={refresh}>
              <RefreshCw className={loading ? 'animate-spin' : ''} />
              새로고침
            </Button>
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
        {loading ? (
          <output aria-live="polite" className="rounded-2xl bg-slate-50 p-5">
            최신 상세 기록을 불러오는 중…
          </output>
        ) : error ? (
          <div role="alert" className="rounded-2xl bg-red-50 p-5">
            <p className="text-red-700">{error}</p>
            <Button className="mt-3" onClick={refresh}>
              다시 불러오기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.lesson_no}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-9 place-items-center rounded-xl font-black ${item.completed ? 'bg-emerald-100 text-emerald-700' : item.current_step !== null ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {item.lesson_no}
                    </div>
                    <div>
                      <p className="font-black">{item.lesson_no}차시</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.current_step !== null
                          ? `${item.current_step}단계 · ${item.updated_at ? date(item.updated_at) : ''}`
                          : '아직 저장된 활동이 없습니다'}
                      </p>
                    </div>
                  </div>
                  {item.completed ? (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      완료
                    </Badge>
                  ) : item.current_step !== null ? (
                    <Badge variant="outline">진행 중</Badge>
                  ) : null}
                </div>
                {item.reflection_status === 'deleted' ? (
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-slate-600">
                    게시글 완전 삭제됨 · 학습 진도와 완료 기록은 유지됩니다.
                  </p>
                ) : (
                  item.reflection && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 leading-7 text-slate-700">
                      <p className="font-bold">
                        {reflectionLabels[item.reflection_status]}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words">
                        {item.reflection}
                      </p>
                    </div>
                  )
                )}
              </article>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
