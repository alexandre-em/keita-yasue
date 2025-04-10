'use server';
import { UserServiceIns } from '@/services';

export async function POST(request: Request) {
  const res = await request.json();

  const user = await UserServiceIns.createOne(res satisfies UserType);

  return Response.json(user);
}
