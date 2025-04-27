'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TypographyMuted } from '@/components/typography';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { statusColor } from '@/constants';

type TransactionsListProps = {
  data: TransactionType[];
  user: UserType;
};

export default function TransactionsList({ data, user }: TransactionsListProps) {
  return (
    <div className="mt-2 rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {data?.map((transaction) => {
            const date = new Date(transaction.date);
            const timeZone = user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

            return (
              <Link legacyBehavior key={`transaction-n${transaction.id}`} href={`/dashboard/transactions/${transaction.id}`}>
                <TableRow className="cursor-pointer">
                  <TableCell>{transaction.id?.split('-')[0]}</TableCell>
                  <TableCell className="font-medium flex flex-wrap items-center">
                    <Avatar className="mr-2 hidden sm:block">
                      <AvatarImage src={(transaction.user as UserType).image ?? undefined} />
                      <AvatarFallback>{(transaction.user as UserType).name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {(transaction.user as UserType).name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor[transaction.status]}>{transaction.status}</Badge>
                  </TableCell>
                  <TableCell>{transaction.amount / 100}</TableCell>
                  <TableCell>{transaction.currency}</TableCell>
                  <TableCell>{transaction.packageType.replaceAll('_', ' ')}</TableCell>
                  <TableCell>
                    {date.toLocaleString('en-us', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
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
          <TypographyMuted>No transaction found</TypographyMuted>
        </div>
      )}
    </div>
  );
}
