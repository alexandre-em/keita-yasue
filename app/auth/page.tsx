'use client';
import { UserCredential } from 'firebase/auth';
import { CircleCheckBig, CircleX, Loader } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { createSession } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import googleAuthInstance from '@/lib/auth';
import { UserServiceIns } from '@/services';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const user: UserCredential = await googleAuthInstance.signIn();

      toast('Welcome back !', {
        description: `Redirecting to the dashboard in few seconds...`,
        icon: <CircleCheckBig />,
      });

      const userResult = await UserServiceIns.getById(user.user.uid);
      let result = userResult.result;

      if (!result?.exists()) {
        await UserServiceIns.createOne(user.user.uid, {
          name: user.user.displayName!,
          email: user.user.email!,
          image: user.user.photoURL!,
          level: 0,
          createdAt: new Date(),
          id: user.user.uid,
          role: 'user',
          emailVerifiedAt: new Date(),
        });

        result = (await UserServiceIns.getById(user.user.uid)).result;
      }

      const stringDetails = JSON.stringify(result?.data());

      await createSession(user.user.uid, stringDetails);
    } catch (error) {
      toast('An error occurred while signing in', {
        description: `${error}`,
        icon: <CircleX />,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-[calc(100dvh-57px)] flex justify-center items-center">
      <Card>
        <CardHeader>
          <img src="/welcome.png" className="h-[150px] w-[112.45px] self-center" />
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>You are trying to access a restricted page. Please authenticate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} disabled={loading}>
            {loading && <Loader className="animate-spin mr-2" />}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
