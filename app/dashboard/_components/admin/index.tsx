import { TypographyH1, TypographyH3 } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import { ReservationServiceIns, UserServiceIns } from '@/services';
import React from 'react';
import ReservationList from '../ReservationList';
import UserList from '../UserList';
import NumberCard from '@/components/NumberCard';
import { isBefore } from 'date-fns';

type AdminDashboardType = {
  user: UserType;
};

export default async function AdminDashboard({ user }: AdminDashboardType) {
  const reservations = await ReservationServiceIns.getByUser(user.id, { limit: 100, orderByQuery: 'desc', role: user.role });
  const latestRegisteredUsers = await UserServiceIns.getRecentNewUsers();

  const reservationSuccess = reservations.data.filter(
    (reservation) => reservation.status === 'VALIDATED' && isBefore(new Date(), reservation.startDate)
  );
  const reservationDone = reservations.data.filter((reservation) => reservation.status === 'DONE');
  const reservationToValidate = reservations.data.filter((reservation) => reservation.status === 'TO_VALIDATE');

  const highlights = [
    {
      title: 'New students',
      value: latestRegisteredUsers.length,
      footer: 'the last 30 days',
      trendIcon: true,
    },
    {
      title: 'Booking pending validation',
      value: reservationToValidate.length,
      footer: 'the last 30 days',
      trendIcon: true,
    },
    {
      title: 'Booking validated',
      value: reservationSuccess.length,
      footer: 'the last 30 days',
      trendIcon: true,
    },
    {
      title: 'Lessons done',
      value: reservationDone.length,
      footer: 'the last 30 days',
      trendIcon: true,
    },
  ];

  return (
    <div className="flex flex-col m-5 mt-0 w-full overflow-x-hidden">
      <TypographyH1>Dashboard</TypographyH1>
      <Separator className="my-2" />
      <div className="flex overflow-auto mt-2">
        {highlights.map((highlight) => (
          <NumberCard data={highlight} key={JSON.stringify(highlight)} />
        ))}
      </div>

      <div className="flex flex-wrap">
        <div className="min-w-[150px] max-w-[500px] text-primary m-5">
          <TypographyH3>📅 Next lesssons</TypographyH3>
          <ReservationList data={reservationSuccess} user={user} />
        </div>
        <div className="min-w-[150px] max-w-[500px] text-primary m-5">
          <TypographyH3>⚠️ Latest booking to validate</TypographyH3>
          <ReservationList data={reservationToValidate} user={user} />
        </div>
        <div className="min-w-[150px] max-w-[500px] text-primary m-5">
          <TypographyH3>🆕 Users registered the last 30 days</TypographyH3>
          <UserList data={latestRegisteredUsers} />
        </div>
      </div>
    </div>
  );
}
