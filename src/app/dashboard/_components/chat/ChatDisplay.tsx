'use client';
import { Send } from 'lucide-react';
import { ChangeEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TypographyMuted } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ConversationServiceIns } from '@/services';

import { useChat } from './ChatProvider';

interface ChatDisplayProps {
  conversation: ConversationType | null;
  user: UserType;
}

export function ChatDisplay({ conversation, user }: ChatDisplayProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chat = useChat();
  const dest = conversation?.members.filter((member) => (member as UserType).id !== user.id)[0] as UserType;
  const [message, setMessage] = useState('');

  const callError = useCallback((error: unknown) => {
    console.error(error);

    toast({
      title: 'An error occurred...',
      variant: 'destructive',
    });
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView(false);
    }
  };

  const isValid = useMemo(() => {
    const isOnlyTab = message.split(' ').filter((c) => !!c).length === 0;
    const isOnlySpace = message.split(' ').filter((c) => !!c).length === 0;
    return !message && !isOnlySpace && !isOnlyTab;
  }, [message]);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (conversation?.id && user?.id && isValid) {
        ConversationServiceIns.addMessage(conversation?.id, {
          id: crypto.randomUUID(),
          author: user,
          content: message,
          date: new Date(),
        })
          .then((res) => {
            if (res.error) callError(res.error);
          })
          .finally(() => {
            setMessage('');
          });
      }
    },
    [callError, conversation, message, user, isValid]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (conversation?.id && user?.id) {
          ConversationServiceIns.addMessage(conversation?.id, {
            id: crypto.randomUUID(),
            author: user,
            content: message,
            date: new Date(),
          })
            .then((res) => {
              if (res.error) callError(res.error);
            })
            .finally(() => {
              setMessage('');
            });
        }
      }
    },
    [callError, conversation, message, user]
  );

  // Adding last view with user id
  useEffect(() => {
    if (chat?.selected && conversation) {
      scrollToBottom();
      ConversationServiceIns.updateViewed(conversation, user.id);
    }
  }, [chat?.selected, conversation, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  if (!conversation || !dest)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <TypographyMuted>No conversation selected</TypographyMuted>
      </div>
    );

  return (
    <div className="flex w-full h-[calc(100dvh-390px)] flex-col">
      <div className="flex flex-1 flex-col h-full">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage src={dest.image} alt={dest.name} />
              <AvatarFallback>
                {dest.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{dest.name}</div>
            </div>
          </div>
          {conversation.messages[conversation.messages.length - 1] && (
            <div className="ml-auto text-xs text-muted-foreground">
              {(conversation.messages[conversation.messages.length - 1].date as Date).toLocaleString()}
            </div>
          )}
        </div>
        <Separator />
        <div className="flex-1 whitespace-pre-wrap p-4 text-sm h-full">
          <ScrollArea className="h-full no-scrollbar">
            <div ref={chatContainerRef}>
              {conversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`w-full mb-3 flex flex-col ${msg.author.id === user.id ? 'items-end' : 'items-start'}`}
                >
                  <Badge variant={msg.author.id === user.id ? 'color' : 'secondary'} className="text-sm">
                    {msg.content}
                  </Badge>
                  <p className="italic text-xs text-muted-foreground opacity-50">
                    Send the {(msg.date as Date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator className="mt-auto" />
        <div className="p-4">
          <div className="grid gap-4">
            <Textarea
              value={message}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              className="p-4 bg-[#ffffffe0]"
              placeholder={`Chat with ${dest.name}...`}
            />
            <Button disabled={!isValid} onClick={handleSubmit} size="sm">
              <Send className="mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
