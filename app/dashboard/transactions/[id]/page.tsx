import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
} from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { statusCancellationLevel, statusColor, statusValidationLevel } from '@/constants';
import { getUserDetail } from '@/constants/cookies';
import { TransactionsServiceIns } from '@/services';
import { ChevronRight, Loader } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import UpdateTransactionStatus from './_components/UpdateTransactionStatus';
import CancelTransactionDialog from './_components/CancelTransactionDialog';

export default async function TransactionPage({ params }: IdParamsType) {
  const { id } = await params;
  const user = await getUserDetail();

  const transaction = await TransactionsServiceIns.getById(id);
  const statusArray =
    transaction?.status === 'CANCELLED' || transaction?.status === 'TO_CANCEL' ? statusCancellationLevel : statusValidationLevel;
  const statusLevelIndex = transaction?.status ? statusArray.indexOf(transaction.status) : 0;

  if (transaction === undefined)
    return (
      <div className="flex flex-wrap">
        <Loader className="mr-2 animate-spin" />
        <TypographyLarge>Loading...</TypographyLarge>;
      </div>
    );
  if (transaction === null) redirect('/error');

  return (
    <div className="m-5 mt-0 w-full">
      <TypographyH1>Transaction</TypographyH1>
      <TypographyMuted>#{id}</TypographyMuted>

      {/*  User information + chat */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mt-2">
          <Avatar>
            <AvatarImage src={transaction.user.image ?? undefined} />
            <AvatarFallback>{transaction.user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-2">
            <TypographySmall>{transaction.user.name}</TypographySmall>
          </div>
        </div>
      </div>

      {/* Reservation detail */}
      <div className="flex flex-wrap w-full">
        <Card className="my-5 grow">
          <CardHeader>
            <CardTitle>Reservation&apos;s details</CardTitle>
            <div className="flex flex-wrap">
              {statusArray.map((s, i) => (
                <div key={s} className="flex">
                  <Badge
                    variant={i > statusLevelIndex ? 'outline' : statusColor[s as StatusType]}
                    className={i < statusLevelIndex ? 'opacity-40' : ''}
                  >
                    {s}
                  </Badge>
                  {i === statusArray.length - 1 ? '' : <ChevronRight className="text-zinc-300" />}
                </div>
              ))}
            </div>
            {transaction.updatedAt && <p className="text-xs italic">Updated the {transaction.updatedAt.toLocaleString()}</p>}
          </CardHeader>

          <CardContent>
            <CardDescription className="capitalize flex justify-between items-center">
              <div>
                Reservation for the <TypographyLead>{transaction.packageType.replaceAll('_', ' ')}</TypographyLead>
              </div>
              <TypographyH2>
                {transaction.amount / 100}
                {transaction.currency}
              </TypographyH2>
            </CardDescription>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap">
              {/* Cancel buttons for users */}
              {user.role === 'USER' && (transaction.status === 'TO_VALIDATE' || transaction.status === 'VALIDATED') && (
                <CancelTransactionDialog id={id} status={transaction.status} />
              )}

              {/* Updates buttons for admin */}
              {user.role === 'ADMIN' && <UpdateTransactionStatus id={id} transaction={transaction} user={user} />}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
