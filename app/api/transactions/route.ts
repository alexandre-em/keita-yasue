'use server';
import { TransactionsServiceIns } from '@/services';

export async function POST(request: Request) {
  const res = await request.json();

  const reservation = await TransactionsServiceIns.createOne(res);

  return Response.json(reservation);
}
