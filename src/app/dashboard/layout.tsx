import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ChatProvider } from './_components/chat/ChatProvider';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <ChatProvider>
      {children}
      <Link href="/dashboard/conversation" className={cn('fixed bottom-5 right-5', buttonVariants())}>
        <MessageCircle />
      </Link>
    </ChatProvider>
  );
}
