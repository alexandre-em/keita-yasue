import { TypographyH1, TypographyH3 } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CreateReservation from '../CreateReservation';
import { getUserDetail } from '@/constants/cookies';
import { ReservationServiceIns, UserServiceIns } from '@/services';
import NumberCard from '@/components/NumberCard';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReservationList from '../ReservationList';
import Link from 'next/link';
import { isBefore } from 'date-fns';
import AddCreditCard from '../AddCredit';
import MarkdownViewer from '@/components/Viewer';

export default async function UserDashboard() {
  const user = await getUserDetail();
  const userDetail = await UserServiceIns.getById(user.id);
  const reservations = await ReservationServiceIns.getByUser(user.id, { limit: 10000, orderByQuery: 'desc', role: user.role });

  const highlights = [
    {
      title: 'Lesson completed  🎉',
      value: reservations.data.filter((d) => d.status === 'DONE').length,
      trendIcon: false,
    },
    {
      title: 'Lesson pending  🕚',
      value: reservations.data.filter((d) => d.status === 'TO_VALIDATE').length,
      trendIcon: false,
    },
  ];

  const doneLessons = reservations.data.filter((res) => res.status === 'DONE');
  const lastLesson = doneLessons.length > 0 ? doneLessons[0] : null;

  const validatedLessons = reservations.data.filter((res) => res.status === 'VALIDATED' && isBefore(new Date(), res.startDate));
  const pendingLessons = reservations.data.filter((res) => res.status === 'PENDING');
  const nextLesson = validatedLessons.length > 0 ? validatedLessons[0] : null;

  return (
    <div className="flex flex-col m-5 mt-0 w-full overflow-x-hidden">
      <TypographyH1>Dashboard</TypographyH1>
      <Separator className="my-2" />
      <div className="flex overflow-auto mt-2 w-auto">
        {nextLesson && (
          <Card className="min-w-[200px] w-[250px] mx-2">
            <CardContent className="flex-col items-start gap-1 text-sm">
              <CardDescription className="flex items-center">Next lesson 📅</CardDescription>
              <div className="h-[1rem]" />
              <CardTitle className="@[350px]/card:text-3xl text-2xl font-semibold tabular-nums flex">
                {nextLesson.startDate.toLocaleString('en-En', {
                  hour: 'numeric',
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}{' '}
                -
                {nextLesson.endDate.toLocaleString('en-En', {
                  hour: 'numeric',
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </CardTitle>
              <div className="text-muted-foreground">
                {nextLesson.startDate.toLocaleString('en-En', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                })}
              </div>
            </CardContent>
            <CardFooter>
              <a href={`/dashboard/reservation/${nextLesson.id}`}>
                <Button>See details</Button>
              </a>
            </CardFooter>
          </Card>
        )}
        <AddCreditCard user={user} />
        <Separator orientation="vertical" className="mx-1" />
        <CreateReservation user={userDetail!} />
        {highlights.map((highlight) => (
          <NumberCard data={highlight} key={JSON.stringify(highlight)} />
        ))}
      </div>
      {/* Last review */}
      <div className="h-[2rem]" />
      {lastLesson?.studentReview && (
        <>
          <div className="flex justify-between">
            <TypographyH3>Last lesson&apos;s review</TypographyH3>
            <Link href={`/dashboard/reservation/${lastLesson.id}`}>
              <Button variant="outline">Read more</Button>
            </Link>
          </div>
          <div className="h-[0.5rem]" />
          <MarkdownViewer
            content={JSON.parse(lastLesson.studentReview)
              .split('\n')
              .filter((_: string, i: number) => i < 5)
              .join('\n')}
          />
        </>
      )}
      <div className="h-10" />
      {pendingLessons.length > 0 && (
        <div className="text-primary">
          <div className="flex justify-between">
            <TypographyH3> 🕚 Time updated lessons to validated</TypographyH3>
            <Link href="/dashboard/reservation">
              <Button variant="outline">View all</Button>
            </Link>
          </div>
          <ReservationList user={user} data={pendingLessons.filter((_, i) => i !== 5)} />
        </div>
      )}
      <div className="text-primary my-5">
        <div className="flex justify-between">
          <TypographyH3>Lessons done</TypographyH3>
          <Link href="/dashboard/reservation">
            <Button variant="outline">View all</Button>
          </Link>
        </div>
        <ReservationList user={user} data={doneLessons.filter((_, i) => i !== 5)} />
      </div>
    </div>
  );
}
