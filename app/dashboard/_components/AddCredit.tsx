'use client';
import { Button } from '@/components/ui/button';
import { BanknoteArrowUp, CircleCheckBig, CircleX, Loader } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { group, prices } from '@/components/PricingCard';
import { TypographyBold, TypographyLead, TypographyMuted } from '@/components/typography';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import PaymentSvg from '@/components/svg/Payment';
import { sendMessageMail } from '@/actions/mail';
import { admin } from '@/constants/admin';

type CreateReservationProps = {
  user: UserType;
};

export default function AddCreditCard({ user }: CreateReservationProps) {
  return (
    <Card>
      <CardContent className="flex items-center">
        <PaymentSvg width={220} height={150} />
        <div className="w-[2rem]" />
        <div>
          <TypographyLead>Prepay now, and schedule anytime!</TypographyLead>
          <TypographyMuted>You have {user.credit} credits</TypographyMuted>
          <div className="h-[1rem]" />
          <CreditDialog user={user} />
        </div>
      </CardContent>
    </Card>
  );
}

type CreditDialogProps = {
  user: UserType;
};

export function CreditDialog({ user }: CreditDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<Partial<TransactionType> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const addCredit = useCallback(async () => {
    if (selectedPlan) {
      setLoading(true);
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          body: JSON.stringify({
            amount: selectedPlan.amount!,
            currency: selectedPlan.currency!,
            packageType: selectedPlan.packageType!,
            date: new Date(),
            createdAt: new Date(),
            userId: user.id,
            status: 'PENDING',
          } satisfies Omit<TransactionType, 'id'>),
        });

        await sendMessageMail(
          admin,
          user,
          `${user.name} has payed for ${selectedPlan.packageType} package (${(selectedPlan.amount ?? 0) / 100} ${selectedPlan.currency}). Please check your revolut account and validate the transaction, so ${user.name} can have his credits to be able to book a lesson.`
        );

        window.open('https://revolut.me/keitadzx', '_blank')!.focus();

        toast('Success !', {
          description: 'Reservation created. A confirmation mail has been sent',
          icon: <CircleCheckBig />,
        });
      } catch (e) {
        console.error(e);
        toast('An error occurred...', {
          description: 'Please wait if reservation created or try again later',
          icon: <CircleX />,
        });
      } finally {
        setLoading(false);
        setOpen(false);
      }
    }
  }, [selectedPlan, user]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <BanknoteArrowUp />
          Buy Lesson Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add credit to your account</DialogTitle>
          <DialogDescription>Select the package you want. 1 credit = 1 hour of reservation.</DialogDescription>
          <DialogDescription className="flex justify-between items-center">
            💰 Your actual credit :{' '}
            <TypographyLead>
              <div className="text-[#ff920f] font-extrabold">{user.credit ?? 0}</div>
            </TypographyLead>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="w-full grid gap-4">
            <PlanSelect onSelect={setSelectedPlan} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={addCredit}>{loading ? <Loader className="animate-spin" /> : 'Top Up'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type PlanSelectProps = {
  onSelect: ({ packageType, amount, currency }: { packageType: PackageType; amount: number; currency: string }) => void;
};

function PlanSelect({ onSelect }: PlanSelectProps) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang: 'ja' | 'en' | 'eu' = timeZone === 'Asia/Tokyo' ? 'ja' : timeZone === 'Europe/London' ? 'en' : 'eu';

  const handleSelect = useCallback(
    (selectedValue: string) => {
      const selectedPlan = JSON.parse(selectedValue);
      onSelect(selectedPlan);
    },
    [onSelect]
  );

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a pack" className="w-full" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Single student</SelectLabel>
          {prices.map((price) => (
            <SelectItem key={`plan-select-${price.title}`} value={JSON.stringify(price.price[lang])}>
              <TypographyBold>{price.title}</TypographyBold> / {price.price[lang].title as string}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Multiple students</SelectLabel>
          {Object.keys(group.prices).map((key) => (
            <SelectItem
              key={`plan-select-${group.prices[key as keyof typeof group.prices][lang].title}`}
              value={JSON.stringify(group.prices[key as keyof typeof group.prices][lang])}
            >
              <div className="capitalize">
                <TypographyBold>{key}</TypographyBold>
              </div>{' '}
              / {group.prices[key as keyof typeof group.prices][lang].title as string}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
