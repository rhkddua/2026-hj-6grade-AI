import type { Metadata } from 'next';
import { env } from 'cloudflare:workers';

import './globals.css';

export const metadata: Metadata = {
  title: 'AI 코딩 교실 | 생각을 앱으로 만드는 10번의 모험',
  description: '초등학교 6학년 학생을 위한 10차시 AI 코딩 수업 플랫폼',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const runtimeEnv = env as unknown as Record<string, unknown>;
  const supabaseUrl = typeof runtimeEnv.VITE_SUPABASE_URL === 'string' ? runtimeEnv.VITE_SUPABASE_URL : '';
  const supabasePublishableKey = typeof runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY === 'string' ? runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY : '';

  return (
    <html
      lang="ko"
      data-supabase-url={supabaseUrl}
      data-supabase-publishable-key={supabasePublishableKey}
    >
      <body>{children}</body>
    </html>
  );
}
