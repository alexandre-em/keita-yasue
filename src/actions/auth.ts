'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from '@/constants/cookies';

export async function createSession(uid: string, details?: string) {
  cookies().set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    expires: 60 * 60 * 24,
    path: '/',
  });

  if (details) {
    cookies().set(USER_COOKIE_NAME, details, {
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
  cookies().delete(SESSION_COOKIE_NAME);
  cookies().delete(USER_COOKIE_NAME);

  redirect('/');
}
