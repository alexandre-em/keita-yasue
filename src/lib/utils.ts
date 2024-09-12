import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fbTimeToDate(date: FirebaseDateType) {
  return new Date(date.seconds * 1000);
}
