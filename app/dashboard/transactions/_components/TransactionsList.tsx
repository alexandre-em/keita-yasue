'use client';
import React from 'react';

type TransactionsListProps = {
  transactions: TransactionType[];
};

export default function TransactionsList({ transactions }: TransactionsListProps) {
  console.log({ transactions });
  return <div>TransactionsList</div>;
}
