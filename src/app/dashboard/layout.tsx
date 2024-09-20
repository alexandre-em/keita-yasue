import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ChatProvider } from './_components/chat/ChatProvider';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full min-h-[calc(100dvh-76px)]">
      <ChatProvider>
        {children}
        <Link href="/dashboard/conversation" className={cn('fixed bottom-5 right-5', buttonVariants())}>
          <MessageCircle />
        </Link>
      </ChatProvider>
      <div className="absolute bg-[#b07edf] w-[100px] h-[100px] top-[-20px] left-2 rounded-full opacity-30 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10dvw] h-[10dvw] max-h-[250px] max-w-[250px] top-72 left-72 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[30px] h-[30px] bottom-48 left-36 rounded-full opacity-70 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10px] h-[10px] top-28 right-36 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[50dvw] h-[50dvw] max-h-[500px] max-w-[500px] bottom-0 right-5 rounded-full opacity-10 z-[-999]"></div>
    </div>
  );
}
