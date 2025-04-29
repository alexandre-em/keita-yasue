type ConversationType = {
  id?: string;
  members: UserType[] | string[];
  messages: MessageType[];
  createdAt: Date;
  lastMessage: Date;
};

type MessageType = {
  id?: string;
  author: UserType;
  date: Date | FirebaseDateType;
  content: string;
  viewed?: Date;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt?: Date | null;
  credit?: number;
  timezone?: string | null;
  googleId?: string | null;
  image: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
};

type ReservationType = {
  id?: string;
  startDate: Date;
  endDate: Date;
  author: UserType | string;
  meeting_link?: string | null;
  studentReview?: string | null;
  courseReview?: string | null;
  status: StatusType;
  update: ReservationHistoryType | string | null;
  createdAt: Date;
  updatedAt?: Date;
};

type ReservationHistoryType = {
  id?: string;
  newStartDate: Date;
  newEndDate: Date;
  oldStartDate: Date;
  oldEndDate: Date;
  author: UserType | string;
  createdAt: Date;
  updatedAt?: Date;
};

type PackageType =
  | 'ONE_HOUR_PACK'
  | 'FOUR_HOURS_PACK'
  | 'TWELVE_HOURS_PACK'
  | 'TWO_PERSONS_PACK'
  | 'THREE_PERSONS_PACK'
  | 'FOUR_PERSONS_PACK';

type TransactionType = {
  id?: string;
  date: Date;
  user?: UserType | string;
  userId: string;
  amount: number;
  currency: string;
  packageType: PackageType;
  status: StatusType;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

type StatusType = 'IDLE' | 'PENDING' | 'TO_VALIDATE' | 'TO_CANCEL' | 'VALIDATED' | 'CANCELLED' | 'DONE';

type EntityType = ConversationType | MessageType | UserType | ReservationType | ReviewType | StatusType;
type EntityTypes = 'conversations' | 'messages' | 'users' | 'reservations' | 'transactions' | 'statuts';
