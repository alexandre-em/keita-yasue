'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { TypographyBold, TypographyMuted } from './typography';
import { useSidebar } from './ui/sidebar';

export default function UserCard({ user }: { user: UserType }) {
  const { open } = useSidebar();

  if (!open)
    return (
      <Avatar className="ml-1 w-[22px] h-[22px]">
        <AvatarImage src={user.image ?? ''} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    );

  return (
    <div className="flex items-center m-2">
      <Avatar className="h-[40px] w-[40px]">
        <AvatarImage src={user.image ?? ''} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-2">
        <TypographyBold>{user.name}</TypographyBold>
        <TypographyMuted>
          {user.credit ?? 0} credit{user.credit && user.credit > 1 ? 's' : ''}
        </TypographyMuted>
      </div>
    </div>
  );
}
