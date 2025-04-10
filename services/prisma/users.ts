import prisma from '@/lib/prisma';

export class UserService {
  protected collection: EntityTypes;

  constructor() {
    this.collection = 'users';
  }

  getById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  getByField(key: string, value: string) {
    return prisma.user.findFirst({
      where: {
        [key]: value,
      },
    });
  }

  async getRecentNewUsers() {
    const today = new Date();
    return prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date(today).setDate(today.getDate() - 30)),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createOne(data: UserType) {
    return prisma.user.create({
      data,
    });
  }

  updateOne(id: string, data: Partial<UserType>) {
    return prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  deleteOne(id: string) {
    return prisma.user.update({
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }
}
