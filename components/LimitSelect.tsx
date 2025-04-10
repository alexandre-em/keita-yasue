'use client';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { redirect } from 'next/navigation';

type LimitSelectProps = {
  limit: string;
};

export default function LimitSelect({ limit }: LimitSelectProps) {
  return (
    <Select value={limit} onValueChange={(value) => redirect(`/dashboard/reservation?limit=${value}`)}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Limit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Limit</SelectLabel>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="200">200</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
