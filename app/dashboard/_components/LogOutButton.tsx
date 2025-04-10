'use client';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import googleAuthInstance from '@/lib/auth';
import { Ghost, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function LogOutButton() {
  const handleLogOff = async () => {
    await googleAuthInstance.signOut();

    toast('See you soon !', {
      description: 'You have been successfully logged out',
      icon: <Ghost />,
    });
  };

  return (
    <SidebarMenu onClick={handleLogOff}>
      <SidebarMenuItem className="text-muted-foreground text-xs ml-2">
        <SidebarMenuButton asChild>
          <span>
            <LogOut /> <span>Log off</span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
