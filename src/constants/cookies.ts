import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'user_session';
export const USER_COOKIE_NAME = 'user_detail';

export function getCookies(key: string) {
  const reqCookies = cookies();

  return reqCookies.get(key)?.value;
}

export function getUserDetail(): UserType {
  return JSON.parse(getCookies(USER_COOKIE_NAME) || '') as UserType;
}
