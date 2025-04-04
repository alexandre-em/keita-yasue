'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from '@/constants/cookies';

export async function createSession(uid: string, details?: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    expires: 60 * 60 * 24,
    path: '/',
  });

  if (details) {
    cookieStore.set(USER_COOKIE_NAME, details, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // One day
      expires: 60 * 60 * 24,
      path: '/',
    });
  }

  redirect('/dashboard');
}

export async function removeSession() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);

  redirect('/');
}
