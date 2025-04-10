'use server';
import { ReservationServiceIns } from '@/services';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const day = searchParams.get('day') ? new Date(searchParams.get('day') as string) : new Date();

  const reservation = await ReservationServiceIns.getLessonsTimeByDay(day);

  return Response.json(reservation);
}
