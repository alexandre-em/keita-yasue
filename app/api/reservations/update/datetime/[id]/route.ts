import { ReservationServiceIns } from '@/services';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await request.json();

  const reservationHistory = await ReservationServiceIns.createReservationHistory(res satisfies Partial<ReservationHistoryType>);
  const reservation = await ReservationServiceIns.updateOne(id, {
    update: reservationHistory.id,
    status: 'PENDING',
    startDate: res.newStartDate,
    endDate: res.newEndDate,
  } satisfies Partial<ReservationType>);

  return Response.json(reservation);
}
