'use client';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { CalendarIcon, Loader } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import CursorPagination from '@/components/CursorPagination';
import FilterPagination from '@/components/FilterPagination';
import { TypographyH3, TypographyLarge, TypographyMuted } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { statusColor } from '@/constants';
import { fbTimeToDate } from '@/lib/utils';
import { ReservationServiceIns } from '@/services';

type ReservationListProps = {
  limit: number;
  after: string;
  before: string;
  status: StatusType;
};

type PaginateReservationListType = {
  reservations: ReservationType[];
  result: QuerySnapshot<DocumentData, DocumentData> | null;
  error: unknown;
};

const getReservationList = async (user: UserType, options: FirebasePaginationOptionsType) => {
  const { result, error } = await ReservationServiceIns.getReservationByUser(user.role === 'user' ? user.id : undefined, options);
  const reservations = result?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    startDate: fbTimeToDate(doc.data().startDate),
    endDate: fbTimeToDate(doc.data().endDate),
    createdAt: fbTimeToDate(doc.data().createdAt),
    updatedAt: doc.data().updatedAt ? fbTimeToDate(doc.data().updatedAt) : undefined,
    deletedAt: doc.data().deletedAt ? fbTimeToDate(doc.data().deletedAt) : undefined,
  })) as ReservationType[];

  return { result, error, reservations };
};

export default function ReservationList({ limit, after, before, status, user }: ReservationListProps & { user: UserType }) {
  const [reservationResult, setReservationResult] = useState<PaginateReservationListType>();
  const [loading, setLoading] = useState(false);
  const options: FirebasePaginationOptionsType = useMemo(
    () => ({
      lim: limit,
      cursor: { after, before },
      status,
      orderByQuery: {
        value: 'startDate',
        order: 'desc',
      },
    }),
    [limit, after, before, status]
  );

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      getReservationList(user, options)
        .then((res) => setReservationResult(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, options]);

  if (!reservationResult || loading)
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time slot</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="w-full flex justify-center items-center mt-5">
          <Loader className="mr-2 animate-spin text-muted-foreground" />
          <TypographyMuted>Loading reservations...</TypographyMuted>
        </div>
      </>
    );
  if (reservationResult && reservationResult.error)
    return <TypographyLarge>An error occurred. Please try again later.</TypographyLarge>;

  const cursorAfter = reservationResult?.result?.docs[limit - 1]?.id || '';
  const cursorBefore = reservationResult?.result?.docs[0]?.id || '';

  return (
    <div className="mt-5">
      <div className="flex flex-wrap justify-between">
        <FilterPagination searchParams={{ limit, after, before, status }} />
        <Popover>
          <PopoverTrigger>
            <Button variant="outline" className="rounded-full">
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <TypographyH3>Reservations</TypographyH3>
            <Calendar
              mode="multiple"
              selected={reservationResult.reservations
                .filter((res) => res.startDate >= new Date() && res.status !== 'CANCELLED')
                .map((res) => res.startDate)}
              disabled={reservationResult.reservations.map((res) => res.startDate).filter((date) => date < new Date())}
              className="rounded-md border w-fit mt-2 bg-white"
            />
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time slot</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservationResult.reservations?.map((reserv) => (
            <Link legacyBehavior key={`reserv-n${reserv.id}`} href={`/dashboard/reservation/${reserv.id}`}>
              <TableRow className="cursor-pointer">
                <TableCell>{reserv.id?.split('-')[0]}</TableCell>
                <TableCell className="font-medium flex flex-wrap items-center">
                  <Avatar className="mr-2 hidden sm:block">
                    <AvatarImage src={reserv.user.image} />
                    <AvatarFallback>{reserv.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {reserv.user.name}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColor[reserv.status]}>{reserv.status}</Badge>
                </TableCell>
                <TableCell>
                  {reserv.startDate.toLocaleString('en-us', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {reserv.startDate.toLocaleString('en-us', { hour: 'numeric', hour12: true, minute: 'numeric' })} -{' '}
                  {reserv.endDate.toLocaleString('en-us', { hour: 'numeric', hour12: true, minute: 'numeric' })}
                </TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
      {(!reservationResult.reservations || (reservationResult.reservations && reservationResult.reservations.length === 0)) && (
        <div className="w-full text-center my-2">
          <TypographyMuted>No reservation found</TypographyMuted>
        </div>
      )}
      <CursorPagination cursor={{ after: cursorAfter, before: cursorBefore }} limit={limit.toString()} />
    </div>
  );
}
