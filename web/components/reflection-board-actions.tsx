'use client';

import Link from 'next/link';
import {
  ArrowRight,
  LoaderCircle,
  MessageSquareShare,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { publishLessonReflection } from '@/lib/reflection-board';

type ShareStatus = 'idle' | 'sending' | 'sent' | 'error';

export function ReflectionBoardActions({
  lessonNo,
  reflection,
}: {
  lessonNo: number;
  reflection: string;
}) {
  const [shareState, setShareState] = useState<{
    status: ShareStatus;
    reflection: string;
  }>({ status: 'idle', reflection: '' });
  const trimmed = reflection.trim();
  const status = shareState.reflection === trimmed ? shareState.status : 'idle';

  async function publish() {
    if (trimmed.length < 10) return;
    setShareState({ status: 'sending', reflection: trimmed });
    try {
      await publishLessonReflection(lessonNo, trimmed);
      setShareState({ status: 'sent', reflection: trimmed });
    } catch {
      setShareState({ status: 'error', reflection: trimmed });
    }
  }

  return (
    <section
      className="mt-5 overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 sm:p-5"
      aria-labelledby={`reflection-share-title-${lessonNo}`}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-700 text-white">
          <MessageSquareShare className="size-5" />
        </span>
        <div className="min-w-0">
          <h3
            id={`reflection-share-title-${lessonNo}`}
            className="font-black text-teal-950"
          >
            친구들과 한 문장 나누기
          </h3>
          <p className="mt-1 text-sm leading-6 text-teal-900">
            이름 없이 문장만 게시돼요. 이름·연락처·주소·비밀번호는 쓰지 마세요.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          onClick={() => void publish()}
          disabled={trimmed.length < 10 || status === 'sending'}
        >
          {status === 'sending' ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <MessageSquareShare />
          )}
          {status === 'sending'
            ? '보내는 중…'
            : status === 'sent'
              ? '게시판에 다시 보내기'
              : '게시판에 보내기'}
        </Button>
        <Button
          render={<Link href={`/reflection-board?lesson=${lessonNo}`} />}
          variant="outline"
          className="bg-white"
        >
          한 문장 게시판 보기
          <ArrowRight />
        </Button>
      </div>
      <output
        aria-live="polite"
        className={`mt-3 block text-sm font-bold leading-6 ${status === 'error' ? 'text-red-700' : 'text-teal-800'}`}
      >
        {trimmed.length < 10 && '10자 이상 작성하면 게시판에 보낼 수 있어요.'}
        {trimmed.length >= 10 &&
          status === 'idle' &&
          '보내면 같은 차시의 이전 문장이 새 문장으로 바뀌어요.'}
        {status === 'sent' &&
          '게시판에 보냈어요! 다른 친구들의 문장도 확인해 보세요.'}
        {status === 'error' &&
          '게시판에 보내지 못했어요. 개인정보가 없는지 확인하고 다시 시도해 주세요.'}
      </output>
      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-teal-700">
        <ShieldCheck className="size-4" />
        게시판에는 작성자의 이름과 학번을 표시하지 않아요.
      </div>
    </section>
  );
}
