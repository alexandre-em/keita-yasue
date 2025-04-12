'use server';
import { ReservationServiceIns } from '@/services';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  console.log({ searchParams });
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const page = parseInt(searchParams.get('page') ?? '0');
  const status = searchParams.get('status') as StatusType;
  const role = (searchParams.get('role') as 'ADMIN' | 'USER') ?? 'USER';
  const orderByQuery = (searchParams.get('orderByQuery') as 'asc' | 'desc') ?? 'desc';

  const reservation = await ReservationServiceIns.getByUser(id, {
    limit,
    page,
    status,
    role,
    orderByQuery,
  });

  return Response.json(reservation);
}
