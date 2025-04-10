'use client';

import { AvatarFallback } from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';

import { TypographyMuted } from '@/components/typography';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { useChat } from './ChatProvider';

interface MailListProps {
  items: ConversationType[];
  user: UserType;
}

export function ChatList({ items, user }: MailListProps) {
  const chat = useChat();
  const dests = items.map((conv) => conv.members.filter((memb) => (memb as UserType).id !== user.id)) as UserType[][];
  const destMessages = items.map((conv) => conv.messages.filter((msg) => msg.author.id !== user.id));

  if (!chat) return <TypographyMuted>Loading...</TypographyMuted>;

  return (
    <ScrollArea className="max-h-[calc(100dvh-150px)] overflow-y-auto">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item, i) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border my-2 p-3 text-left text-sm transition-all hover:bg-accent',
              chat.selected === item.id && 'bg-muted'
            )}
            onClick={() => chat.setSelected(item.id)}
          >
            <div className="flex w-full gap-1">
              <Avatar>
                <AvatarImage src={dests[i][0].image ?? undefined} />
                <AvatarFallback>{dests[i][0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="font-bold">{item.members.map((mem) => (mem as UserType).name.split(' ')[0]).join('/')}</div>
                  {destMessages[i] && !destMessages[i].reduce((prev, curr) => prev && !!curr.viewed, true) && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className={cn('text-xs italic', chat.selected === item.id ? 'text-foreground' : 'text-muted-foreground')}>
                  {formatDistanceToNow(item.lastMessage ? item.lastMessage : item.createdAt, {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.messages && item.messages[item.messages.length - 1]?.content.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
