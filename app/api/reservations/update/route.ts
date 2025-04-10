'use server';
import { ReservationServiceIns } from '@/services';

export async function POST(request: Request) {
  const res = await request.json();

  const reservation = await ReservationServiceIns.updateOne(res.id, res satisfies Partial<ReservationType>);

  return Response.json(reservation);
}
