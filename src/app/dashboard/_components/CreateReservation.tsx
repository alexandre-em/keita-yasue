'use client';

import { send } from '@emailjs/browser';
import { format } from 'date-fns';
import { BookOpenCheck, Calendar as CalendarIcon, Loader } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { sendReservationMail } from '@/actions/mail';
import { TypographyMuted, TypographySmall } from '@/components/typography';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NEXT_PUBLIC_EMAILJS_RESERVATION_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_SERVICE_ID } from '@/constants/env';
import { toast } from '@/hooks/use-toast';
import '@/lib/email';
import { cn, fbTimeToDate } from '@/lib/utils';
import { ReservationServiceIns } from '@/services';

const START_HOUR = 8;
const BREAK_HOUR = 12;
const END_HOUR = 20;

type CreateReservationProps = {
  user: UserType;
};

export default function CreateReservation({ user }: CreateReservationProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [dateRanges, setDateRanges] = useState<number[] | undefined>();
  const [selectedRange, setSelectedRange] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendConfirmationMail = useCallback(
    async (date: string, time: string) => {
      const newData = {
        date,
        time,
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
      const startDate = new Date(date.getTime());
      startDate.setHours(selectedRange, 0, 0, 0);
      const endDate = new Date(startDate.getTime());
      endDate.setHours(selectedRange + 1, 0, 0, 0);
      const isDateValid = startDate > new Date();

      if (isDateValid && user && user.id) {
        try {
          await ReservationServiceIns.createOne({
            user,
            status: 'TO_VALIDATE',
            startDate,
            endDate,
            createdAt: new Date(),
          });

          // Send a confirmation mail
          const dateLocale = startDate.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
          const timeLocale = `${startDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric' })} to ${endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric' })}`;
          sendConfirmationMail(dateLocale, timeLocale);

          toast({
            title: 'Success !',
            description: 'Reservation created. A confirmation mail has been sent',
            variant: 'success',
          });
        } catch (e) {
          toast({
            title: 'An error occurred...',
            description: 'Please wait if reservation created or try again later',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }

        return;
      }
    }
    toast({
      title: 'An error occurred...',
      description: 'Please select a valid date',
      variant: 'destructive',
    });
  }, [date, selectedRange, user, sendConfirmationMail]);

  useEffect(() => {
    ReservationServiceIns.getUnAvailableHoursByDate(date)
      .then((res) => {
        const docs = res.result?.docs;

        const hours = docs
          ?.filter((doc) => (doc.data() as ReservationType).status !== 'CANCELLED')
          .map((doc) => fbTimeToDate((doc.data() as ReservationType).startDate as unknown as FirebaseDateType).getHours());

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDay = new Date(date);
        selectedDay.setHours(0, 0, 0, 0);

        const isSelectedDayToday = today.getTime() === selectedDay.getTime();

        const ranges = [];
        const istart = isSelectedDayToday ? new Date().getHours() + 1 : START_HOUR;

        for (let i = istart; i < END_HOUR; i++) {
          if (i !== BREAK_HOUR && !hours?.includes(i)) {
            ranges.push(i);
          }
        }

        if (ranges.length > 0) setDateRanges(ranges);
      })
      .catch(console.error);
  }, [date]);

  if (user.role === 'admin') return;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BookOpenCheck className="mr-2" />
          Book a course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reservation</DialogTitle>
          <DialogDescription>Get an hour course with me. If you want more, please reiterate it.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <DatePicker date={date} onSelect={setDate} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <DateRangeSelect onSelect={(value: string) => setSelectedRange(JSON.parse(value))} ranges={dateRanges} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={createReservation}>{loading ? <Loader className="animate-spin" /> : 'Reserve'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DatePickerProps = {
  date: Date;
  onSelect: React.Dispatch<React.SetStateAction<Date>>;
};

function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => onSelect(day!)}
          initialFocus
          required
          disabled={(date: Date) => date <= new Date() || date.getDay() === 0 || date.getDay() === 6}
        />
      </PopoverContent>
    </Popover>
  );
}

type DateRangeSelectProps = {
  ranges?: number[];
  onSelect: (s: string) => void;
};

function DateRangeSelect({ onSelect, ranges }: DateRangeSelectProps) {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a time slot" />
      </SelectTrigger>
      <SelectContent>
        {ranges?.map((i) => (
          <SelectItem key={`date-range-select-${i}`} value={i.toString()}>
            {i}:00
          </SelectItem>
        ))}
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
