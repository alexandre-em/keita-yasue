'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useState } from 'react';

export type ChatContextValueType = {
  open: boolean;
  selected?: string;
  loading: boolean;
  onNewRoom: (roomId: string) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContextValueType | null>(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewRoom = useCallback(
    (roomId: string) => {
      if (router) {
        setOpen(true);
        setSelected(roomId);

        router.push('/dashboard/conversation');
      }
    },
    [router]
  );

  return (
    <ChatContext.Provider
      value={{
        open,
        selected,
        loading,
        onNewRoom: handleNewRoom,
        setOpen,
        setSelected,
        setLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
