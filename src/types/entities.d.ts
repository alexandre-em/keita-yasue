type ConversationType = {
  id: string;
  members: UserType[];
  messages: MessageType[];
};

type MessageType = {
  id: string;
  author: UserType;
  date: Date | FirebaseDateType;
  content: string;
};

type UserType = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: Date;
  password?: string;
  level: number;
  image: string;
  reservation: ReservationType[];
  createdAt: Date;
  deletedAt?: Date;
};

type ReservationType = {
  id: string;
  startDate: Date;
  endDate: Date;
  user: User;
  review: ReviewType;
  status: StatusType;
  createdAt: Date;
  updatedAt?: Date;
};

type ReviewType = {
  id: string;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
};

type StatusType = {
  id: string;
  status: 'TO_VALIDATE' | 'TO_CANCEL' | 'VALIDATED' | 'CANCELLED';
  createdAt: Date;
  updatedAt?: Date;
};
