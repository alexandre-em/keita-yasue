import { ChevronRight, Loader } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

import {
  TypographyH1,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
} from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { statusCancellationLevel, statusColor, statusValidationLevel } from '@/constants';
import { admin } from '@/constants/admin';
import { getUserDetail } from '@/constants/cookies';
import { ReservationServiceIns } from '@/services';

import CancelReservationDialog from './_components/CancelReservationDialog';
import UpdateReservationReview from './_components/UpdateReservationReview';
import UpdateReservationStatus from './_components/UpdateReservationStatus';
import ChatDestButton from '../../_components/chat/ChatDestButton';

export default async function ReservationId({ params }: IdParamsType) {
  const { id } = await params;
  const user = await getUserDetail();

  const reservation = await ReservationServiceIns.getById(id);

  const statusArray =
    reservation?.status === 'CANCELLED' || reservation?.status === 'TO_CANCEL' ? statusCancellationLevel : statusValidationLevel;
  const statusLevelIndex = reservation?.status ? statusArray.indexOf(reservation.status) : 0;

  if (reservation === undefined)
    return (
      <div className="flex flex-wrap">
        <Loader className="mr-2 animate-spin" />
        <TypographyLarge>Loading...</TypographyLarge>;
      </div>
    );
  if (reservation === null) redirect('/error');

  return (
    <div className="m-5 mt-0 w-full">
      <TypographyH1>Reservation</TypographyH1>
      <TypographyMuted>#{id}</TypographyMuted>

      {/*  User information + chat */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mt-2">
          <Avatar>
            <AvatarImage src={reservation.author.image ?? undefined} />
            <AvatarFallback>{reservation.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2">
            <TypographySmall>{reservation.author.name}</TypographySmall>
          </div>
        </div>
        {(user.role !== 'ADMIN' || user.id !== reservation.author.id) && (
          <ChatDestButton user={user} dest={user.role === 'ADMIN' ? reservation.author : admin} />
        )}
      </div>

      {/* Reservation detail */}
      <Card className="my-5">
        <CardHeader>
          <CardTitle>Reservation&apos;s details</CardTitle>
          <div className="flex flex-wrap">
            {statusArray.map((s, i) => (
              <div key={s} className="flex">
                <Badge
                  variant={i > statusLevelIndex ? 'outline' : statusColor[s as StatusType]}
                  className={i < statusLevelIndex ? 'opacity-40' : ''}
                >
                  {s}
                </Badge>
                {i === statusArray.length - 1 ? '' : <ChevronRight className="text-zinc-300" />}
              </div>
            ))}
          </div>
          {reservation.updatedAt && <p className="text-xs italic">Updated the {reservation.updatedAt.toLocaleString()}</p>}
        </CardHeader>
        <CardContent>
          <CardDescription>
            Reservation for the{' '}
            <TypographyInlineCode>
              {reservation.startDate.toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
            </TypographyInlineCode>
          </CardDescription>
          <div className="flex flex-wrap items-center mt-2">
            <TypographyLead>
              {reservation.startDate.toLocaleString('en-us', {
                hour: 'numeric',
                minute: 'numeric',
                timeZone: user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
            </TypographyLead>
            <ChevronRight className="text-zinc-500" />
            <TypographyLead>
              {reservation.endDate.toLocaleString('en-us', {
                hour: 'numeric',
                minute: 'numeric',
                timeZone: user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
            </TypographyLead>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap">
            {/* Cancel buttons for users */}
            {user.role === 'USER' && (reservation.status === 'TO_VALIDATE' || reservation.status === 'VALIDATED') && (
              <CancelReservationDialog id={id} status={reservation.status} />
            )}

            {/* Updates buttons for admin */}
            {user.role === 'ADMIN' && (
              <>
                <UpdateReservationStatus id={id} />
                {(reservation.status === 'DONE' || reservation.status === 'VALIDATED') && (
                  <UpdateReservationReview id={id} review={reservation.studentReview} />
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Reservation review */}
      {reservation.studentReview && (
        <Card>
          <CardHeader>
            <CardTitle className="mb-2">Resume of the lesson</CardTitle>
            {reservation.studentReview.split('\\n').map((review, i) => (
              <p key={`${review}-${i}`} className="text-muted-foreground text-sm leading-none italic [&:not(:first-child)]:mt-6">
                {review}
              </p>
            ))}
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
