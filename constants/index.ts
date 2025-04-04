export const protectedRoutes = [/\/dashboard/g];

export const statusColor: Record<StatusType, 'destructive' | 'outline' | 'success' | 'default' | 'secondary'> = {
  CANCELLED: 'destructive',
  TO_CANCEL: 'outline',
  TO_VALIDATE: 'secondary',
  VALIDATED: 'success',
  DONE: 'default',
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
