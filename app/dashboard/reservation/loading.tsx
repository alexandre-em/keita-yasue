import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function ReservationLoading() {
  return (
    <div className="flex flex-col w-full mb-5">
      <div className="space-y-2 my-2">
        <Skeleton className="h-10 w-[350px] bg-muted" />
        <Skeleton className="h-6 w-[500px] bg-muted" />
      </div>
      <Skeleton className="h-full w-full rounded-xl bg-muted w-11/12" />
    </div>
  );
}
