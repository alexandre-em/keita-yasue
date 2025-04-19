import { TypographyH2, TypographyMuted } from '@/components/typography';
import { Separator } from '@/components/ui/separator';
import { getUserDetail } from '@/constants/cookies';
import { TransactionsServiceIns } from '@/services';
import React from 'react';
import TransactionsList from './_components/TransactionsList';

export default async function TransactionsPage({ searchParams }: IdParamsType) {
  const { limit = '10', cursor, status } = await searchParams;
  const user = await getUserDetail();
  const transactions = await TransactionsServiceIns.getByUser(user.id, {
    limit: parseInt(limit),
    cursor,
    status: status,
    role: user.role,
  });

  return (
    <div className="flex flex-col m-5 mt-0 w-full h-full overflow-x-hidden">
      <div>
        <TypographyH2>Transaction list</TypographyH2>
        <TypographyMuted>You can find all of your transaction here</TypographyMuted>
      </div>
      <Separator className="my-2" />

      <TransactionsList data={transactions.data} user={user} />
    </div>
  );
}
