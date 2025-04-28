import prisma from '@/lib/prisma';

export class ReservationsService {
  protected collection: EntityTypes;

  constructor() {
    this.collection = 'reservations';
  }

  getById(id: string) {
    return prisma.reservation.findFirst({
      relationLoadStrategy: 'join',
      include: {
        author: true,
        update: true,
      },
      where: {
        id,
      },
    });
  }

  getByField(key: string, value: string) {
    return prisma.reservation.findFirst({
      where: {
        [key]: value,
      },
    });
  }

  async getByUser(id: string, options: PrismaPaginationOptionsType) {
    const { cursor, limit, status, orderByQuery = 'desc', role } = options;
    const where: Record<string, string> = role === 'ADMIN' ? {} : { authorId: id };

    const nextCursor = cursor
      ? {
          id: cursor,
        }
      : undefined;

    if (status) where['status'] = status;

    // const totalElement = await prisma.reservation.count({
    //   where,
    // });
    const totalElement = 0;

    // const selectedPage = page * limit >= totalElement ? Math.max(totalElement - limit, 0) : page * limit < 0 ? 0 : options.page;

    const results = await prisma.reservation.findMany({
      skip: cursor ? 1 : 0,
      take: limit ?? 1000000,
      cursor: nextCursor,
      relationLoadStrategy: 'join',
      include: {
        author: true,
      },
      where,
      orderBy: {
        startDate: orderByQuery,
      },
    });

    return {
      cursor,
      limit: limit,
      totalPage: Math.ceil(totalElement / (limit ?? 1)),
      totalElement,
      data: results,
    };
  }

  getLessonsTimeByDay(day: Date) {
    return prisma.reservation.findMany({
      select: {
        startDate: true,
        endDate: true,
      },
      where: {
        startDate: {
          gte: new Date(new Date(day).setHours(1, 0, 0, 0)),
          lte: new Date(new Date(day).setHours(23, 59, 59)),
        },
      },
    });
  }

  createOne(data: ReservationType) {
    return prisma.reservation.create({
      data: {
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: data.author! as string,
      },
    });
  }

  updateOne(id: string, data: Partial<Omit<ReservationType, 'author'>>) {
    const newData = {
      ...data,
      reservationHistoriesId: data.update ? data.update : undefined,
    };

    delete newData.update;

    return prisma.reservation.update({
      data: newData as Partial<Omit<ReservationType, 'author' | 'update'>>,
      where: {
        id,
      },
    });
  }

  createReservationHistory(data: ReservationHistoryType) {
    return prisma.reservationHistories.create({
      data: {
        authorId: data.author! as string,
        oldEndDate: new Date(data.oldEndDate),
        oldStartDate: new Date(data.oldStartDate),
        newStartDate: new Date(data.newStartDate),
        newEndDate: new Date(data.newEndDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  deleteOne(id: string) {
    return prisma.reservation.delete({
      where: {
        id,
      },
    });
  }
}
