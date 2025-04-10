'use server';
import { UserServiceIns } from '@/services';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await UserServiceIns.getById(id);

  return Response.json(user);
}
