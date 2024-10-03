import { ChevronRight, Loader } from 'lucide-react';
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
import { levelName, statusCancellationLevel, statusColor, statusValidationLevel } from '@/constants';
import { admin } from '@/constants/admin';
import { getUserDetail } from '@/constants/cookies';
import { fbTimeToDate } from '@/lib/utils';
import { ReservationServiceIns } from '@/services';

import UpdateReservationReview from './_components/UpdateReservationReview';
import UpdateReservationStatus from './_components/UpdateReservationStatus';
import ChatDestButton from '../../_components/chat/ChatDestButton';

export default async function ReservationId({ params: { id } }: IdParamsType) {
  const user = getUserDetail();
  // eslint-disable-next-line
  const { result, error } = await ReservationServiceIns.getById(id);

  const reservation = result?.data()
    ? ({
        ...result.data(),
        createdAt: fbTimeToDate(result.data()!.createdAt),
        startDate: fbTimeToDate(result.data()!.startDate),
        endDate: fbTimeToDate(result.data()!.endDate),
        updatedAt: result.data()!.updatedAt ? fbTimeToDate(result.data()!.updatedAt) : undefined,
        deletedAt: result.data()!.deletedAt ? fbTimeToDate(result.data()!.deletedAt) : undefined,
      } as ReservationType)
    : null;

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
  if (error || reservation === null) return <TypographyLarge>An error occurred. Please try again later.</TypographyLarge>;

  return (
    <div className="m-5 mt-0">
      <TypographyH1>Reservation</TypographyH1>
      <TypographyMuted>#{id}</TypographyMuted>

      {/*  User information + chat */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mt-2">
          <Avatar>
            <AvatarImage src={reservation.user.image} />
            <AvatarFallback>{reservation.user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2">
            <TypographySmall>{reservation.user.name}</TypographySmall>
            <TypographyMuted>
              Level {reservation.user.level} - {levelName[reservation.user.level!]}
            </TypographyMuted>
          </div>
        </div>
        {(user.role !== 'admin' || user.id !== reservation.user.id) && (
          <ChatDestButton user={user} dest={user.role === 'admin' ? reservation.user : admin} />
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
              {reservation.startDate.toLocaleString('en-us', { hour: 'numeric', minute: 'numeric' })}
            </TypographyLead>
            <ChevronRight className="text-zinc-500" />
            <TypographyLead>{reservation.endDate.toLocaleString('en-us', { hour: 'numeric', minute: 'numeric' })}</TypographyLead>
          </div>
        </CardContent>
        {user.role === 'admin' && (
          <CardFooter>
            <div className="flex flex-wrap">
              <UpdateReservationStatus id={id} />
              {(reservation.status === 'DONE' || reservation.status === 'VALIDATED') && (
                <UpdateReservationReview id={id} review={reservation.review} />
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Reservation review */}
      {reservation.review && (
        <Card>
          <CardHeader>
            <CardTitle className="mb-2">Resume of the lesson</CardTitle>
            {reservation.review.split('\n').map((review, i) => (
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
