import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'AI 코딩 교실 | 생각을 앱으로 만드는 10번의 모험',
  description: '초등학교 6학년 학생을 위한 10차시 AI 코딩 수업 플랫폼',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
