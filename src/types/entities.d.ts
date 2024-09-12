type ConversationType = {
  id?: string;
  members: UserType[];
  messages: MessageType[];
};

type MessageType = {
  id?: string;
  author: UserType;
  date: Date | FirebaseDateType;
  content: string;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt?: Date;
  password?: string;
  level?: number;
  image: string;
  // reservation: ReservationType[];
  role: 'admin' | 'user';
  createdAt?: Date;
  deletedAt?: Date;
};

type ReservationType = {
  id?: string;
  startDate: Date;
  endDate: Date;
  user: User;
  review?: string;
  status: StatusType;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

type StatusType = 'TO_VALIDATE' | 'TO_CANCEL' | 'VALIDATED' | 'CANCELLED' | 'DONE';

type EntityType = ConversationType | MessageType | UserType | ReservationType | ReviewType | StatusType;
type EntityTypes = 'conversations' | 'messages' | 'users' | 'reservations' | 'reviews' | 'statuts';
