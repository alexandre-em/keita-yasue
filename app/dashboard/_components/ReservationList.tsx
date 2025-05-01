'use client';
import { Loader } from 'lucide-react';
import Link from 'next/link';

import { TypographyMuted } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { statusColor } from '@/constants';

type ReservationListProps = {
  data: Omit<ReservationType, 'update'>[];
  user: UserType;
  loading?: boolean;
};

export default function ReservationList({ data, user, loading }: ReservationListProps) {
  if (loading === true)
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
          <TableBody className="w-full flex justify-center items-center mt-5">
            <Loader className="mr-2 animate-spin text-muted-foreground" />
            <TypographyMuted>Loading reservations...</TypographyMuted>
          </TableBody>
        </Table>
      </>
    );

  return (
    <div className="mt-2 rounded-sm border bg-white">
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
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {data?.map((reserv) => {
            const startDate = new Date(reserv.startDate);
            const endDate = new Date(reserv.endDate);
            const timeZone = user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

            return (
              <Link legacyBehavior key={`reserv-n${reserv.id}`} href={`/dashboard/reservation/${reserv.id}`}>
                <TableRow className="cursor-pointer">
                  <TableCell>{reserv.id?.split('-')[0]}</TableCell>
                  <TableCell className="font-medium flex flex-wrap items-center">
                    <Avatar className="mr-2 hidden sm:block">
                      <AvatarImage src={(reserv.author as UserType).image ?? undefined} />
                      <AvatarFallback>{(reserv.author as UserType).name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {(reserv.author as UserType).name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor[reserv.status]}>{reserv.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {startDate.toLocaleString('en-us', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      timeZone,
                    })}
                  </TableCell>
                  <TableCell>
                    {startDate.toLocaleString('en-us', {
                      hour: 'numeric',
                      hour12: true,
                      minute: 'numeric',
                      timeZone,
                    })}{' '}
                    -{' '}
                    {endDate.toLocaleString('en-us', {
                      hour: 'numeric',
                      hour12: true,
                      minute: 'numeric',
                      timeZone,
                    })}
                  </TableCell>
                </TableRow>
              </Link>
            );
          })}
        </TableBody>
      </Table>
      {(!data || (data && data.length === 0)) && (
        <div className="w-full h-full flex flex-col justify-center items-center my-2">
          <img src="/error.png" alt="error" className="h-[150px]" />
          <TypographyMuted>No reservation found</TypographyMuted>
        </div>
      )}
    </div>
  );
}
