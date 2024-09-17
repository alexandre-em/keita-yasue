'use client';
import { UserCredential } from 'firebase/auth';
import React, { useCallback, useState } from 'react';

import { createSession } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import googleAuthInstance from '@/lib/auth';
import { UserServiceIns } from '@/services';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      const user: UserCredential = await googleAuthInstance.signIn();

      toast({
        title: 'Welcome back !',
        description: `Redirecting to dashboard in few seconds...`,
        variant: 'success',
      });

      let result = (await UserServiceIns.getById(user.user.uid)).result;

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
      toast({
        title: 'An error occurred while signing in',
        description: `${error}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-[calc(100dvh-57px)] flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Admin page</CardTitle>
          <CardDescription>You are trying to access to a protected route. Please authenticate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
