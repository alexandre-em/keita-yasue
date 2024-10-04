import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Keita Yasue's website",
  description: 'Keita Yasue, a Japanese Language Teacher based in Japan, Osaka',
  keywords: [
    'japanese',
    'teacher',
    'japan',
    'JLPT',
    '日本語能力試験',
    'にほんごのうりょくしけん',
    'Japanese-Language Proficiency Test',
  ],
  openGraph: {
    title: `Keita Yasue's website`,
    description: 'Keita Yasue, a Japanese Language Teacher based in Japan, Osaka',
    type: 'website',
    images: '/thumbnail.png',
    // url: 'https://alexandre-em.fr',
  },
};

const navBarMessages = {
  about: 'About',
  contact: 'Contact',
  dashboard: 'Sign In',
  meetup: 'MeetUp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-[#fffcf7]')}>
        <Navbar messages={navBarMessages} />
        <main className="min-h-[calc(100dvh-97px)] flex flex-col mt-[calc(1.25rem+36px)]">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
