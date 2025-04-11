'use server';
import { UserServiceIns } from '@/services';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  console.log({ id });

  const user = await UserServiceIns.getByField('googleId', id);

  return Response.json(user);
}
