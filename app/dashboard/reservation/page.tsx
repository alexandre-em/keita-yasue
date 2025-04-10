import React from 'react';

import { getUserDetail } from '@/constants/cookies';
import ReservationList from '../_components/ReservationList';
import { Separator } from '@/components/ui/separator';
import { TypographyH2, TypographyMuted } from '@/components/typography';
import { ReservationServiceIns } from '@/services';
// import { Button } from '@/components/ui/button';
// import LimitSelect from '@/components/LimitSelect';
// import Link from 'next/link';
// import { Skeleton } from '@/components/ui/skeleton';

export default async function ReservationPage({ searchParams }: IdParamsType) {
  const { limit = '10', cursor, status } = await searchParams;
  const user = await getUserDetail();
  const reservations = await ReservationServiceIns.getByUser(user.id, {
    limit: parseInt(limit),
    cursor,
    status: status,
    role: user.role,
  });

  return (
    <div className="flex flex-col m-5 mt-0 w-full h-full overflow-x-hidden">
      <TypographyH2>Lesson booking list</TypographyH2>
      <TypographyMuted>You can find all of your booking here</TypographyMuted>
      <Separator className="my-2" />
      <ReservationList user={user} data={reservations.data} />
      {/* <div className="flex items-center justify-between space-x-2 py-4"> */}
      {/*   <LimitSelect limit={limit} /> */}
      {/*   <div className="space-x-2"> */}
      {/*     <Button variant="outline" size="sm"> */}
      {/*       Previous */}
      {/*     </Button> */}
      {/*     <Link href={`/dashboard/reservation?limit=${limit}&cursor=${reservations.cursor}`}> */}
      {/*       <Button variant="outline" size="sm" disabled={!!reservations.cursor}> */}
      {/*         Next */}
      {/*       </Button> */}
      {/*     </Link> */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
}
