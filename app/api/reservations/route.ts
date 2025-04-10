'use server';
import { ReservationServiceIns } from '@/services';

export async function POST(request: Request) {
  const res = await request.json();

  const reservation = await ReservationServiceIns.createOne(res satisfies ReservationType);

  return Response.json(reservation);
}
