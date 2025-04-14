import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { getUserDetail } from '@/constants/cookies';
import { Separator } from './ui/separator';
import { ArrowRightLeft, Clock, LayoutDashboard, PackageOpen, Sheet, UsersRound } from 'lucide-react';
import LogOutButton from '@/app/dashboard/_components/LogOutButton';
import UserCard from './UserCard';

export const adminMenu = [
  {
    name: 'HOME',
    projects: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    name: 'MANAGEMENT',
    projects: [
      {
        name: 'Booking',
        path: '/dashboard/reservation',
        icon: <Sheet />,
      },
      {
        name: 'Students',
        path: '/dashboard/students',
        icon: <UsersRound />,
      },
      {
        name: 'Transactions',
        path: '/dashboard/transactions',
        icon: <ArrowRightLeft />,
      },
      {
        name: 'File storage',
        path: '/dashboard/files',
        icon: <PackageOpen />,
      },
    ],
  },
  {
    name: 'SETTING',
    projects: [
      {
        name: 'Availability',
        path: '/dashboard',
        icon: <Clock />,
      },
    ],
  },
];

export const userMenu = [
  {
    name: 'HOME',
    projects: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard />,
      },
    ],
  },
  {
    name: 'MANAGEMENT',
    projects: [
      {
        name: 'Booking',
        path: '/dashboard/reservation',
        icon: <Sheet />,
      },
      {
        name: 'Transactions',
        path: '/dashboard/transactions',
        icon: <ArrowRightLeft />,
      },
      {
        name: 'File storage',
        path: '/dashboard/files',
        icon: <PackageOpen />,
      },
    ],
  },
];

export default async function AppSidebar() {
  const user = await getUserDetail();

  const menu = user.role === 'ADMIN' ? adminMenu : userMenu;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <UserCard user={user} />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        {menu.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel className="font-semibold text-xs">{group.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.projects.map((project) => (
                  <SidebarMenuItem className="text-muted-foreground text-xs" key={group.name + project.name}>
                    <SidebarMenuButton asChild>
                      <a href={project.path}>
                        {project.icon}
                        <span>{project.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <LogOutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
