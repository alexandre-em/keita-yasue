import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'user_session';
export const USER_COOKIE_NAME = 'user_detail';

export async function getCookies(key: string) {
  const reqCookies = await cookies();

  return reqCookies.get(key)?.value;
}

export async function getUserDetail(): Promise<UserType> {
  return JSON.parse((await getCookies(USER_COOKIE_NAME)) || '') as UserType;
}
