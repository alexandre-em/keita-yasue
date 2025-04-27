'use server';
import { UserServiceIns } from '@/services';

export async function POST(request: Request) {
  const data = await request.json();
  let transaction;

  if (data.type === 'increase') transaction = await UserServiceIns.increaseCredit(data.id, data.credit);
  if (data.type === 'decrease') transaction = await UserServiceIns.decreaseCredit(data.id, data.credit);

  return Response.json(transaction);
}
