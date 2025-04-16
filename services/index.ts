import { ConversationService } from './conversation';
import { UserService } from './prisma/users';
import { ReservationsService } from './prisma/reservations';
import { TransactionsService } from './prisma/transactions';

export const ConversationServiceIns = new ConversationService();
export const UserServiceIns = new UserService();
export const ReservationServiceIns = new ReservationsService();
export const TransactionsServiceIns = new TransactionsService();
