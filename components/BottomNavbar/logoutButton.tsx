'use client';

import googleAuthInstance from "@/lib/auth";
import { Ghost, LogOutIcon } from "lucide-react";
import { toast } from "sonner";

export const LogoutButton = () => {
  const handleLogOff = async () => {
    await googleAuthInstance.signOut();

    toast('See you soon !', {
      description: 'You have been successfully logged out',
      icon: <Ghost />,
    });
  };

  return (
        <div
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
      <button type="button" className="inline-flex flex-col items-center justify-center" onClick={handleLogOff}>
        <div className="text-[#ff930f]"><LogOutIcon /></div>
        <span className="text-[#ff930f]">Logout</span>
      </button>
        </div>
  )
}
