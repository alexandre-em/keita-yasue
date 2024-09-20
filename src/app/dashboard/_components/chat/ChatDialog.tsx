'use client';
import { onSnapshot } from 'firebase/firestore';
import { Contact, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { fbTimeToDate } from '@/lib/utils';
import { ConversationServiceIns, UserServiceIns } from '@/services';
import { FirebaseResponseType } from '@/services/entity';

import { ChatDisplay } from './ChatDisplay';
import { ChatList } from './ChatList';
import { useChat } from './ChatProvider';

type ChatProps = {
  user: UserType;
};

export default function Chat({ user }: ChatProps) {
  const chat = useChat();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [error, setError] = useState<Record<string, string>>();

  useEffect(() => {
    if (user.id) {
      chat?.setLoading(true);
      ConversationServiceIns.getConversationsByUser(user.id, {
        orderByQuery: {
          value: 'lastMessage',
          order: 'desc',
        },
      })
        .then(({ error: err, query }) => {
          if (err) {
            setError(err as Record<string, string>);
          } else {
            onSnapshot(query!, {
              next: (snapshot) => {
                const convers = snapshot.docs.map(async (conver) => {
                  const membersPromiseArray = conver.data().members.map((memberId: string) => UserServiceIns.getById(memberId));

                  const promises = await Promise.all(membersPromiseArray);

                  const membs = promises.map((usr: FirebaseResponseType) => usr.result.data()) as UserType[];

                  return {
                    ...conver.data(),
                    id: conver.id,
                    members: membs,
                    createdAt: fbTimeToDate(conver.data().createdAt),
                    lastMessage: conver.data().lastMessage ? fbTimeToDate(conver.data().lastMessage) : undefined,
                    messages: conver.data().messages.map((msg: MessageType) => ({
                      ...msg,
                      date: fbTimeToDate(msg.date as FirebaseDateType),
                    })) as MessageType[],
                  } as ConversationType;
                });

                Promise.all(convers).then((res) => {
                  setConversations(res);
                });
              },
              error: console.error,
            });
          }
        })
        .finally(() => chat?.setLoading(false));
    }
    // eslint-disable-next-line
  }, [user.id]);

  useEffect(() => {
    if (chat) {
      if (!chat.selected && conversations.length > 0 && conversations[0].id) {
        chat.setSelected(conversations[0].id);
      }
    }
    // eslint-disable-next-line
  }, [chat?.selected, conversations]);

  if (!chat || error) return <TypographyMuted>An error occurred...</TypographyMuted>;
  if (chat && chat.loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="mr-2" />
        <TypographyMuted>Loading...</TypographyMuted>
      </div>
    );

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <TypographyH1>Conversations</TypographyH1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex sm:hidden" variant="outline">
              <Contact className="mr-2" />
              Contacts
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Contact</SheetTitle>
              <Separator />
              <SheetDescription>
                <ChatList items={conversations} user={user} />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Separator className="my-2" />

      <div className="flex flex-row">
        <div className="hidden sm:flex">
          <ChatList items={conversations} user={user} />
        </div>
        <ChatDisplay conversation={conversations.find((item) => item.id === chat.selected) || null} user={user} />
      </div>
    </>
  );
}
