import { cookies } from 'next/headers';

export function getCookies(key: string) {
  const reqCookies = cookies();

  return reqCookies.get(key)?.value;
}
