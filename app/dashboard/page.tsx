import React from 'react';

import { getUserDetail } from '@/constants/cookies';

import AdminDashboard from './_components/admin';
import UserDashboard from './_components/users';

export default async function DashboardPage() {
  const user = await getUserDetail();

  if (user.role === 'ADMIN') return <AdminDashboard user={user} />;

  return <UserDashboard />;
}
