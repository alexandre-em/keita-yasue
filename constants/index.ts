export const protectedRoutes = [/\/dashboard/g];

export const statusColor: Record<StatusType, 'destructive' | 'outline' | 'success' | 'default' | 'secondary'> = {
  CANCELLED: 'destructive',
  TO_CANCEL: 'outline',
  TO_VALIDATE: 'secondary',
  VALIDATED: 'success',
  DONE: 'default',
  IDLE: 'outline',
  PENDING: 'outline',
};

export type PackageType =
  | 'ONE_HOUR_PACK'
  | 'FOUR_HOURS_PACK'
  | 'TWELVE_HOURS_PACK'
  | 'TWO_PERSONS_PACK'
  | 'THREE_PERSONS_PACK'
  | 'FOUR_PERSONS_PACK';

export const creditPackage: Record<PackageType, number> = {
  ONE_HOUR_PACK: 1,
  FOUR_HOURS_PACK: 4,
  TWELVE_HOURS_PACK: 12,
  TWO_PERSONS_PACK: 1,
  THREE_PERSONS_PACK: 1,
  FOUR_PERSONS_PACK: 1,
};

export const levelName = [
  'Beginner 1',
  'Beginner 2',
  'Amateur 1',
  'Amateur 2',
  'Intermediate 1',
  'Intermediate 2',
  'Advanced 1',
  'Advanced 2',
  'Professional',
];

export const statusValidationLevel = ['TO_VALIDATE', 'VALIDATED', 'DONE'];
export const statusCancellationLevel = ['TO_CANCEL', 'CANCELLED'];

// export * from './env';
//
