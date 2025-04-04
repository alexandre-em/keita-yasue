import React from 'react';

import { getUserDetail } from '@/constants/cookies';

import Chat from '../_components/chat/ChatDialog';

export default async function ConversationPage() {
  const user = await getUserDetail();

  return (
    <div className="m-5 mt-0">
      <Chat user={user} />
    </div>
  );
}
