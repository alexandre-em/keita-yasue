import React from 'react';

import { TypographyH1, TypographyH2, TypographyMuted } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import { getUserDetail } from '@/constants/cookies';

import CreateReservation from './_components/CreateReservation';
import ReservationList from './_components/ReservationList';

export default function DashboardPage({
  searchParams: { limit = '10', after = undefined, before = undefined, status },
}: IdParamsType) {
  const user = getUserDetail();

  return (
    <div className="flex flex-col m-5 mt-0">
      <TypographyH1>Dashboard</TypographyH1>
      <Separator className="my-2" />
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <TypographyH2>My reservation</TypographyH2>
          <TypographyMuted>Click on a reservation for more detail</TypographyMuted>
        </div>
        <CreateReservation user={user} />
      </div>
      <ReservationList user={user} limit={parseInt(limit)} after={after} before={before} status={status} />
    </div>
  );
}
