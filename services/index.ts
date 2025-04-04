import { ConversationService } from './conversation';
import { ReservationService } from './reservation';
import { UserService } from './user';

export const ConversationServiceIns = new ConversationService();
export const UserServiceIns = new UserService();
export const ReservationServiceIns = new ReservationService();
