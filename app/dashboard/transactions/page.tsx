import { getUserDetail } from '@/constants/cookies';
import { TransactionsServiceIns } from '@/services';
import React from 'react';

export default async function TransactionsPage({ searchParams }: IdParamsType) {
  const { limit = '10', cursor, status } = await searchParams;
  const user = await getUserDetail();
  const transactions = await TransactionsServiceIns.getByUser(user.id, {
    limit: parseInt(limit),
    cursor,
    status: status,
    role: user.role,
  });

  console.log({ transactions });

  return <div>TransactionsPage</div>;
}
