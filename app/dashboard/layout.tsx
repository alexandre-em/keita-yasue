import React, { PropsWithChildren } from 'react';

import { ChatProvider } from './_components/chat/ChatProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Sidebar';
import BottomNavBar from '@/components/BottomNavbar';
import Link from 'next/link';
import { MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full min-h-full mt-5 overflow-hidden" suppressHydrationWarning>
      <SidebarProvider>
        <AppSidebar />
        <ChatProvider>
          {children}
          <BottomNavBar />
          <Link href="/dashboard/conversation" className={cn(buttonVariants(), 'z-50 fixed bottom-16 right-10 rounded-full')}>
            <MessagesSquare />
            <span>Chat</span>
          </Link>
        </ChatProvider>
      </SidebarProvider>
      <div className="absolute bg-[#b07edf] w-[100px] h-[100px] top-[-20px] left-72 rounded-full opacity-30 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10dvw] h-[10dvw] max-h-[250px] max-w-[250px] top-28 left-72 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[30px] h-[30px] bottom-48 right-36 rounded-full opacity-70 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10px] h-[10px] top-28 right-36 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[50dvw] h-[50dvw] max-h-[500px] max-w-[500px] bottom-0 right-5 rounded-full opacity-10 z-[-999]"></div>
    </div>
  );
}
