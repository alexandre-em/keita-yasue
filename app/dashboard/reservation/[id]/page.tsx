import { ChevronRight, CircleAlert, Loader } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

import {
  TypographyH1,
  TypographyH3,
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
import UpdateReservationStatus from './_components/UpdateReservationStatus';
import ChatDestButton from '../../_components/chat/ChatDestButton';
import VideoConf from '@/components/svg/VideoConf';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MeetingVideo from '@/components/MeetingVideo';
import { isBefore } from 'date-fns';
import UpdateReservationTime from './_components/UpdateReservationTime';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AlertButtonGroup from './_components/AlertButtonGroup';
import MarkdownEditor from '@/components/Editor';
import MarkdownViewer from '@/components/Viewer';

export default async function ReservationId({ params }: IdParamsType) {
  const { id } = await params;
  const user = await getUserDetail();

  const reservation = await ReservationServiceIns.getById(id);
  const author = reservation.author as UserType;
  const update = reservation.update as ReservationHistoryType;

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
            <AvatarImage src={author.image ?? undefined} />

            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2">
            <TypographySmall>{author.name}</TypographySmall>
          </div>
        </div>
        {(user.role !== 'ADMIN' || user.id !== author.id) && (
          <ChatDestButton user={user} dest={user.role === 'ADMIN' ? author : admin} />
        )}
      </div>

      {reservation.status === 'PENDING' && user.id !== (reservation.update as ReservationHistoryType)?.author && (
        <Alert className="mt-5 flex justify-between" variant="info">
          <div className="flex">
            <CircleAlert className="h-4 w-4 mr-2 mt-1" />
            <div className="flex flex-col w-fit">
              <AlertTitle>The lesson&apos;s time has been updated</AlertTitle>
              <AlertDescription>Please confirm the new time to validated the reservation</AlertDescription>
              <AlertDescription className="flex">
                <div className="line-through">
                  {update?.oldStartDate.toLocaleString('en-us', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: user.timezone ?? 'UTC',
                  })}{' '}
                  to{' '}
                  {update?.oldEndDate.toLocaleString('en-us', {
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: user.timezone ?? 'UTC',
                  })}
                </div>
                <div className="font-bold">
                  &gt;{' '}
                  {reservation.startDate.toLocaleString('en-us', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: user.timezone ?? 'UTC',
                  })}{' '}
                  to{' '}
                  {reservation.endDate.toLocaleString('en-us', {
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZone: user.timezone ?? 'UTC',
                  })}
                </div>
              </AlertDescription>
            </div>
          </div>
          <AlertButtonGroup reservation={reservation} user={user} id={id} />
        </Alert>
      )}

      <MeetingVideo reservation={reservation} user={user} />

      {/* Reservation detail */}
      <div className="flex flex-wrap w-full">
        <Card className="my-5 grow">
          <CardHeader>
            <CardTitle>Reservation&apos;s details</CardTitle>
            <div className="flex flex-wrap mt-5">
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
                {reservation.startDate.toLocaleString('en-us', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  weekday: 'long',
                })}
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
              {user.role === 'USER' &&
                (reservation.status === 'TO_VALIDATE' || reservation.status === 'VALIDATED') &&
                isBefore(new Date(), reservation.startDate) && (
                  <CancelReservationDialog id={id} userId={user.id} status={reservation.status} />
                )}

              {/* Updates buttons for admin */}
              {user.role === 'ADMIN' && <UpdateReservationStatus id={id} reservation={reservation} user={user} />}
              {isBefore(new Date(), reservation.startDate) && (
                <div className="mx-5 my-1">
                  <UpdateReservationTime id={id} reservation={reservation} user={user} />
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
        {reservation.meeting_link && (
          <Card className="my-5 ml-5">
            <CardContent>
              <CardTitle>🧑‍💻 Zoom Meet</CardTitle>
              <VideoConf width={200} height={200} />
            </CardContent>
            <CardFooter>
              <Link target="_blank" href={reservation.meeting_link}>
                <Button className="w-full">Join me here</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Reservation review */}

      <TypographyH3>Review of the lesson</TypographyH3>
      <div className="h-[1rem]" />

      {user.role === 'USER' && reservation.studentReview && <MarkdownViewer content={JSON.parse(reservation.studentReview)} />}

      {user.role === 'ADMIN' && reservation.status === 'DONE' && (
        <div className="w-full h-[400px] mb-20">
          <MarkdownEditor
            id={id}
            bodyKey="studentReview"
            submitPath="/api/reservations/update"
            content={
              reservation.studentReview && reservation.studentReview !== '' ? JSON.parse(reservation.studentReview) : '# Title\n'
            }
          />
        </div>
      )}
    </div>
  );
}
