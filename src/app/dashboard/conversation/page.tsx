import React from 'react';

import { getUserDetail } from '@/constants';

import Chat from '../_components/chat/ChatDialog';

export default function ConversationPage() {
  const user = getUserDetail();

  return (
    <div className="m-5 mt-0">
      <Chat user={user} />
    </div>
  );
}
