import React from 'react';

import { TypographyH1, TypographyH2, TypographyMuted } from '@/components/typography';
import { Separator } from '@/components/ui/separator';

import CreateReservation from './_components/CreateReservation';
import ReservationList from './_components/ReservationList';

export default function DashboardPage({
  searchParams: { limit = '10', after = undefined, before = undefined, status },
}: IdParamsType) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-between">
        <TypographyH1>Dashboard</TypographyH1>
        <CreateReservation />
      </div>
      <Separator className="my-2" />
      <TypographyH2>My reservation</TypographyH2>
      <TypographyMuted>Click on a reservation for more detail</TypographyMuted>
      <ReservationList limit={parseInt(limit)} after={after} before={before} status={status} />
    </div>
  );
}
