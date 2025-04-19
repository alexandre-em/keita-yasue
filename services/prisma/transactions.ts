import prisma from '@/lib/prisma';

export class TransactionsService {
  protected collection: EntityTypes;

  constructor() {
    this.collection = 'transactions';
  }

  getById(id: string) {
    return prisma.transaction.findFirst({
      relationLoadStrategy: 'join',
      include: {
        user: true,
      },
      where: {
        id,
      },
    });
  }

  getByField(key: string, value: string) {
    return prisma.transaction.findFirst({
      where: {
        [key]: value,
      },
    });
  }

  async getByUser(id: string, options: PrismaPaginationOptionsType) {
    const { cursor, limit, status, orderByQuery = 'desc', role } = options;
    const where: Record<string, string> = role === 'ADMIN' ? {} : { userId: id };

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
    //
    console.log({ where });

    const results = await prisma.transaction.findMany({
      skip: cursor ? 1 : 0,
      take: limit ?? 1000000,
      cursor: nextCursor,
      relationLoadStrategy: 'join',
      include: {
        user: true,
      },
      where,
      orderBy: {
        date: orderByQuery,
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

  createOne(data: TransactionType) {
    return prisma.transaction.create({
      data: {
        date: new Date(data.date),
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        packageType: data.packageType,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: data.userId! as string,
      },
    });
  }

  updateOne(id: string, data: Partial<Omit<TransactionType, 'user'>>) {
    return prisma.transaction.update({
      data: {
        ...data,
        currency: data.currency ? data.currency.toString() : undefined,
      },
      where: {
        id,
      },
    });
  }

  deleteOne(id: string) {
    return prisma.transaction.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }
}
