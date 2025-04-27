'use server';
import { ReservationServiceIns } from '@/services';
import { NextRequest } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reservation = await ReservationServiceIns.getById(id);

  return Response.json(reservation);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reservation = await ReservationServiceIns.deleteOne(id);

  return Response.json(reservation);
}
