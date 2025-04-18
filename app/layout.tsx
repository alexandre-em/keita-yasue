import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Keita Yasue's website",
  description:
    "Keita Yasue, a Japanese Language Teacher based in Japan, Osaka Welcome to My Japanese Learning World! こんにちは (Konnichiwa)! I'm Keita Yasue, a passionate Japanese language teacher. Whether you're a beginner or looking to polish your skills, I'm here to guide you on your Japanese language journey.",
  keywords: [
    'japanese',
    'teacher',
    'japan',
    'JLPT',
    '日本語能力試験',
    'にほんごのうりょくしけん',
    'Japanese-Language Proficiency Test',
  ],
  icons: {
    icon: [
      {
        url: '/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
      {
        type: 'image/svg',
        url: '/favicon.svg',
      },
    ],
    shortcut: {
      url: '/favicon.ico',
    },
    apple: {
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: `Keita Yasue's website`,
    description: 'Keita Yasue, a Japanese Language Teacher based in Japan, Osaka',
    type: 'website',
    images: '/thumbnail.png',
    // url: 'https://alexandre-em.fr',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-[#f8f8f8]')}>
        <main className="min-h-[calc(100dvh-97px)] w-full flex flex-col">{children}</main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
