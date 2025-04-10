'use client';
import { addHours, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { Calendar as CalendarIcon, CircleCheckBig, CircleX, Clock, Loader } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { sendReservationMail } from '@/actions/mail';
import { TypographyLead, TypographyMuted, TypographySmall } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import Booking from '@/components/svg/Booking';
import { SelectIcon } from '@radix-ui/react-select';

type CreateReservationProps = {
  user: UserType;
};

export default function CreateReservationCard({ user }: CreateReservationProps) {
  return (
    <Card>
      <CardContent className="flex items-center">
        <Booking width={220} height={150} />
        <div className="w-[2rem]" />
        <div>
          <TypographyLead>Ready to take the next step?</TypographyLead>
          <div className="h-[1rem]" />
          <CreateReservation user={user} />
        </div>
      </CardContent>
    </Card>
  );
}

export function CreateReservation({ user }: CreateReservationProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [dateRanges, setDateRanges] = useState<Date[] | undefined>();
  const [selectedRange, setSelectedRange] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const sendConfirmationMail = useCallback(
    async (date: string, time: string, jpTime: string) => {
      const newData = {
        date,
        time,
        jpTime,
      };

      await sendReservationMail(
        {
          email: user.email,
          name: user.name,
        },
        newData
      );
    },
    [user]
  );

  const createReservation = useCallback(async () => {
    if (selectedRange) {
      setLoading(true);
      const endDate = new Date(selectedRange);
      endDate.setHours(selectedRange.getHours() + 1, 0, 0, 0);
      const isDateValid = isAfter(selectedRange, new Date());

      if (isDateValid && user && user.id) {
        try {
          const res = await fetch('/api/reservations', {
            method: 'POST',
            body: JSON.stringify({
              startDate: selectedRange,
              endDate,
              author: user.id,
              status: 'TO_VALIDATE',
              createdAt: new Date(),
            } satisfies Omit<ReservationType, 'id'>),
          });

          if (res.status !== 200) throw new Error('There is already a course booked for this hour.Please try another one.');

          // Send a confirmation mail
          const dateLocale = selectedRange.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const timeLocale = `${selectedRange.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })} to ${endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })}`;
          const jpTime = `${selectedRange.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })} to ${endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })}`;
          await sendConfirmationMail(dateLocale, timeLocale, jpTime);

          toast('Success !', {
            description: 'Reservation created. A confirmation mail has been sent',
            icon: <CircleCheckBig />,
          });
        } catch (e) {
          console.error(e);
          toast('An error occurred...', {
            description: 'Please wait if reservation created or try again later',
            icon: <CircleX />,
          });
        } finally {
          setLoading(false);
          setOpen(false);
        }

        return;
      }
    }
    toast('An error occurred...', {
      description: 'Please select a valid date',
      icon: <CircleX />,
    });
  }, [selectedRange, user, sendConfirmationMail]);

  function getAvailableHours(startDate: Date, endDate: Date, lessons: { startDate: Date; endDate: Date }[]) {
    const hours: Date[] = [];
    let current = new Date(startDate);

    while (isBefore(current, endDate)) {
      const nextHour = addHours(current, 1);

      const isInLesson = lessons.some((lesson) => isWithinInterval(current, { start: lesson.startDate, end: lesson.endDate }));

      if (!isInLesson) {
        hours.push(new Date(current));
      }

      current = nextHour;
    }

    return hours;
  }

  useEffect(() => {
    fetch('/api/reservations/unavailable_time?' + new URLSearchParams({ day: date.toISOString() })).then((res) =>
      res.json().then((datesResponses) => {
        const startTime = new Date(
          new Date(new Date(date).setHours(9, 0, 0))
            .toString()
            .split(' ')
            .filter((_, i) => i < 6)
            .map((d, i) => (i !== 5 ? d : 'GMT+0900'))
            .join(' ')
        );
        const endTime = new Date(
          new Date(new Date(date).setHours(24, 0, 0))
            .toString()
            .split(' ')
            .filter((_, i) => i < 6)
            .map((d, i) => (i !== 5 ? d : 'GMT+0900'))
            .join(' ')
        );
        const formattedDates = datesResponses.map((dr: Record<string, string>) => ({
          startDate: new Date(dr.startDate),
          endDate: new Date(dr.endDate),
        }));

        const available = getAvailableHours(startTime, endTime, formattedDates);

        setDateRanges(available);
      })
    );
  }, [date]);

  if (user.role === 'ADMIN') return;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <CalendarIcon />
          Book a lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Booking</DialogTitle>
          <DialogDescription>Get an hour course with me. If you want more, please reiterate it.</DialogDescription>
          <DialogDescription>Your timezone: {user.timezone}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 bg-white">
            <Calendar mode="single" selected={date} onSelect={(day) => setDate(day!)} required />
          </div>
          <div className="w-full grid gap-4">
            <DateRangeSelect onSelect={setSelectedRange} ranges={dateRanges} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createReservation}>{loading ? <Loader className="animate-spin" /> : 'Confirm your booking'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DateRangeSelectProps = {
  ranges?: Date[];
  onSelect: (s: Date) => void;
};

function DateRangeSelect({ onSelect, ranges }: DateRangeSelectProps) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <Select onValueChange={(d) => onSelect(new Date(d))}>
      <SelectTrigger>
        <SelectIcon>
          <Clock />
        </SelectIcon>
        <SelectValue placeholder="Select a time slot" className="w-full" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{timezone}</SelectLabel>
          {ranges?.map((range) => (
            <SelectItem key={`date-range-select-${range.toISOString()}`} value={range.toISOString()}>
              {range.toLocaleString('en-US', {
                hour: '2-digit',
                minute: 'numeric',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
            </SelectItem>
          ))}
        </SelectGroup>
        {ranges ? (
          ranges.length < 1 && (
            <div className="flex flex-wrap items-center">
              <Loader className="mr-2 animate-spin" /> <TypographySmall>Loading...</TypographySmall>
            </div>
          )
        ) : (
          <TypographyMuted>No time slot available</TypographyMuted>
        )}
      </SelectContent>
    </Select>
  );
}
