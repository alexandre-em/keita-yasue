'use client';
import { Loader, MessageSquare } from 'lucide-react';
import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { ConversationServiceIns } from '@/services';

import { useChat } from './ChatProvider';

type ChatDestDialogProps = {
  dest: UserType;
  user: UserType;
};

export default function ChatDestButton({ dest, user }: ChatDestDialogProps) {
  const chat = useChat();

  const handleClick = useCallback(async () => {
    if (chat) {
      chat.setLoading(true);
      const userMember = dest.role === 'USER' ? dest.id : user.id;
      const res = await ConversationServiceIns.getConversationsByUser(userMember);

      if (res.error) throw new Error('Error while checking conversation');

      const conversations = res.result;
      let conversationId = crypto.randomUUID();

      // Conversation Doesnt exist case
      if (conversations && conversations?.length < 1) {
        await ConversationServiceIns.createOne({
          id: conversationId,
          members: [dest.id, user.id],
          createdAt: new Date(),
          lastMessage: new Date(),
          messages: [],
        });
      } else {
        if (conversations) conversationId = conversations[0].id;
      }

      chat.onNewRoom(conversationId);
      chat.setLoading(false);
    }
  }, [chat, dest, user]);

  if (chat?.loading)
    return (
      <Button variant="outline" onClick={handleClick} disabled>
        <Loader className="mr-2 animate-spin" />
        Openning chat...
      </Button>
    );

  return (
    <Button variant="outline" onClick={handleClick}>
      <MessageSquare className="mr-2" />
      Chat
    </Button>
  );
}
