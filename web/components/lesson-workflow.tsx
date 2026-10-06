import type { ReactNode } from 'react';

export function LessonSchedule({ children }: { children: ReactNode }) {
  return <details className="rounded-xl border p-4 leading-7"><summary className="cursor-pointer font-bold">교사와 함께 보는 40분 운영 안내</summary><p className="mt-3">{children}</p><p className="mt-2 text-sm text-muted-foreground">예상 배분이에요. 생성·수정이 늦으면 한 일을 사실대로 저장하고 이어서 해요. 성공하지 않은 결과를 성공으로 체크하지 않아요.</p></details>;
}

export function CanvaWorkflow({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border-2 border-primary/40 p-4 leading-7"><h3 className="font-black">지금 Canva에서 할 일 → 웹으로 돌아오기</h3>{children}<p className="mt-3 text-sm text-muted-foreground">시험·발표는 앱 공유 URL로 할 수 있어요. 다시 고치려면 원본 Canva 프로젝트나 AI 코드 대화를 열어야 해요. 원본을 보관하세요.</p></div>;
}
