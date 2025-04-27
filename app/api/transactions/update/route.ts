'use server';
import { TransactionsServiceIns } from '@/services';

export async function POST(request: Request) {
  const data = await request.json();

  const transaction = await TransactionsServiceIns.updateOne(data.id, data);

  return Response.json(transaction);
}
