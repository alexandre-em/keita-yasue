'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

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
import useAuth from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { cn, fbTimeToDate } from '@/lib/utils';
import { ReservationServiceIns } from '@/services';

const START_HOUR = 8;
const BREAK_HOUR = 12;
const END_HOUR = 20;

export default function CreateReservation() {
  const user = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [dateRanges, setDateRanges] = useState<number[] | undefined>();
  const [selectedRange, setSelectedRange] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const createReservation = useCallback(async () => {
    if (selectedRange) {
      setLoading(true);
      const startDate = new Date(date.getTime());
      startDate.setHours(selectedRange, 0, 0, 0);
      const endDate = new Date(startDate.getTime());
      endDate.setHours(selectedRange + 1, 0, 0, 0);
      const isDateValid = startDate > new Date();

      if (isDateValid && user && user.uid) {
        const author: UserType = {
          id: user.uid,
          name: user.displayName!,
          email: user.email!,
          role: 'user',
          image: user.photoURL!,
        };

        try {
          await ReservationServiceIns.createOne({
            user: author,
            status: 'TO_VALIDATE',
            startDate,
            endDate,
            createdAt: new Date(),
          });

          // TODO: Send a confirmation mail

          toast({
            title: 'Success !',
            description: 'Reservation created. A confirmation mail has been sent',
            variant: 'success',
          });
        } catch (e) {
          toast({
            title: 'An error occurred...',
            description: 'Reservation creation failed. Please try again',
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
  }, [date, selectedRange, user]);

  useEffect(() => {
    ReservationServiceIns.getUnAvailableHoursByDate(date)
      .then((res) => {
        const docs = res.result?.docs;

        const hours = docs?.map((doc) =>
          fbTimeToDate((doc.data() as ReservationType).startDate as unknown as FirebaseDateType).getHours()
        );

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Reserve a course</Button>
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
          <Button onClick={createReservation}>{loading ? <Loader /> : 'Reserve'}</Button>
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
              <Loader className="mr-2" /> <TypographySmall>Loading...</TypographySmall>
            </div>
          )
        ) : (
          <TypographyMuted>No time slot available</TypographyMuted>
        )}
      </SelectContent>
    </Select>
  );
}
