'use client';
import { redirect } from 'next/navigation';
import React, { useCallback } from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { TypographyH4 } from './typography';

type FilterPaginationProps = {
  searchParams: {
    limit?: number;
    after?: string;
    before?: string;
    status?: StatusType;
  };
};

export default function FilterPagination({ searchParams: { limit, after, before, status } }: FilterPaginationProps) {
  const handleRedirect = useCallback(
    (key: string, value: string) => {
      const query = [];

      if (key === 'limit' || limit !== undefined) query.push(`limit=${key === 'limit' ? value : limit}`);
      if (after !== undefined) query.push(`after=${after}`);
      if (before !== undefined) query.push(`before=${before}`);
      if (key === 'status' || status !== undefined) query.push(`status=${key === 'status' ? value : status}`);

      redirect(`/dashboard?${query.join('&')}`);
    },
    [limit, after, before, status]
  );

  return (
    <div className="w-full flex flex-wrap items-center">
      <TypographyH4>Filter : </TypographyH4>
      <Select onValueChange={(v: string) => handleRedirect('limit', v)} defaultValue={`${limit}`}>
        <SelectTrigger className="w-[180px] mx-2">
          <SelectValue placeholder="Limit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Limit</SelectLabel>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select onValueChange={(v: string) => handleRedirect('status', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value=" ">NONE</SelectItem>
            <SelectItem value="TO_VALIDATE">TO_VALIDATE</SelectItem>
            <SelectItem value="TO_CANCEL">TO_CANCEL</SelectItem>
            <SelectItem value="VALIDATED">VALIDATED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            <SelectItem value="DONE">DONE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
