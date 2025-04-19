import { TypographyBlockquote, TypographyH1, TypographyH3 } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CreateReservation from '../CreateReservation';
import { getUserDetail } from '@/constants/cookies';
import { ReservationServiceIns } from '@/services';
import NumberCard from '@/components/NumberCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReservationList from '../ReservationList';
import Link from 'next/link';
import { isBefore } from 'date-fns';
import { admin } from '@/constants/admin';
import AddCreditCard from '../AddCredit';

export default async function UserDashboard() {
  const user = await getUserDetail();
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
        <CreateReservation user={user} />
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
          <Card>
            <CardHeader>
              <CardTitle>{admin.name} :</CardTitle>
              <TypographyBlockquote>
                {lastLesson.studentReview
                  .split('\\n')
                  .filter((_, i) => i < 5)
                  .map((review, i) => (
                    <p
                      key={`${review}-${i}`}
                      className="text-muted-foreground text-sm leading-none italic [&:not(:first-child)]:mt-2"
                    >
                      {review}
                    </p>
                  ))}
                ...
              </TypographyBlockquote>
            </CardHeader>
          </Card>
        </>
      )}
      <div className="text-primary my-10">
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
