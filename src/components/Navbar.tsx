'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useAuth from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import googleAuthInstance from '@/lib/auth';
import { cn } from '@/lib/utils';

function NavbarMenu({
  className,
  onClick,
  messages,
}: WithClassNameComponentType & { messages?: Record<string, string>; onClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuth();

  const handleRedirect = useCallback(
    (path: string) => {
      if (onClick) {
        onClick();
      }
      router.push(path);
    },
    [onClick, router]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await googleAuthInstance.signOut();

      toast({
        title: 'See you soon !',
        description: 'You have been successfully logged out',
      });

      if (onClick) onClick();

      router.push('/');
    } catch (e) {
      console.log(e);
      toast({
        title: 'Failed',
        description: 'An error occurred... Please try again',
        variant: 'destructive',
      });
    }
  }, [onClick, router]);

  return (
    <NavigationMenuList className={className}>
      <NavigationMenuItem className="m-1 w-full cursor-pointer">
        <NavigationMenuLink
          onClick={() => handleRedirect('/#about')}
          className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
        >
          {messages?.about || 'About'}
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem className="m-1 w-full cursor-pointer">
        <NavigationMenuLink
          onClick={() => handleRedirect('/#contact')}
          className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
        >
          {messages?.contact || 'Contact'}
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem className="m-1 w-full">
        <Button
          onClick={() => (pathname === '/dashboard' ? handleSignOut() : handleRedirect('/dashboard'))}
          className="sm:rounded-3xl rounded-md m-1 w-full"
        >
          {pathname === '/dashboard' ? 'Sign out' : user?.uid ? 'Dashboard' : messages?.dashboard}
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

export default function Navbar({ messages }: { messages: Record<string, string> }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full fixed top-0 z-50">
      <NavigationMenu className="p-2 min-w-full h-[56px] justify-between">
        {/*Left*/}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h2 className="scroll-m-20 text-xl font-extrabold tracking-tight ml-2">Keita Yasue</h2>
          </Link>
        </div>

        {/*Right Laptop*/}
        <NavbarMenu messages={messages} className="hidden sm:flex" />

        {/*Right Smartphone*/}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex justify-center items-center sm:hidden w-[46px] h-[46px] rounded-2xl">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-3">
              <SheetTitle>Keita Yasue</SheetTitle>
              <SheetDescription>Japanese teacher</SheetDescription>
            </SheetHeader>
            <NavbarMenu messages={messages} className="flex flex-col w-full" onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </NavigationMenu>
    </div>
  );
}
