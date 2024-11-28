'use client';
import { BadgeCheck, Clock4, UsersRound } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { TypographyLead, TypographyMuted } from './typography';

type LangEnum = 'ja' | 'eu' | 'en';

const prices = {
  single: {
    ja: `¥3,000`,
    en: '£20',
    eu: '25€',
  },
  group: {
    two: {
      ja: '¥2,800',
      en: '£17',
      eu: '20€',
    },
    three: {
      ja: '¥2,600',
      en: '£14.3',
      eu: '17€',
    },
    four: {
      ja: '¥2,500',
      en: '£13',
      eu: '15€',
    },
  },
  twelve: {
    ja: '¥30,000',
    en: '£200',
    eu: '250€',
  },
  twelveBefore: {
    ja: '¥36,800',
    en: '£240',
    eu: '300€',
  },
  fourBefore: {
    ja: '¥12,000',
    en: '£80',
    eu: '100€',
  },
  four: {
    ja: '¥11,000',
    en: '£70',
    eu: '90€',
  },
};

type PriceCardProps = {
  title: string;
  subtitle?: string;
  footer: string[];
};

export function PriceCard({ title, subtitle, footer }: PriceCardProps) {
  return (
    <Card className="md:max-w-[460px] m-2 w-[90%] h-[90%] transition-transform duration-300 hover:scale-110">
      <CardHeader className="bg-primary-color rounded-t-lg">
        <div className="flex items-center">
          <Clock4 className="text-white mr-2" />
          <CardTitle className="text-white font-bold">{title}</CardTitle>
        </div>
        {subtitle && <CardDescription className="text-muted">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="mt-5">
        <div className="flex items-center">
          <BadgeCheck className="text-primary-color mr-2" />
          <TypographyMuted>In-person lessons or in visio</TypographyMuted>
        </div>
        <div className="flex items-center">
          <BadgeCheck className="text-primary-color mr-2" />
          <TypographyMuted>Audio, video and text resources</TypographyMuted>
        </div>
        <div className="flex items-center">
          <BadgeCheck className="text-primary-color mr-2" />
          <TypographyMuted>Review at the end of the lesson</TypographyMuted>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {footer[1] && (
          <div className="opacity-40 line-through mr-1">
            <TypographyMuted>{footer[1]}</TypographyMuted>
          </div>
        )}
        <TypographyLead>{footer[0]}</TypographyLead>
      </CardFooter>
    </Card>
  );
}

export default function PriceCards() {
  const [lang, setLang] = useState<LangEnum>('en'); // Default to 'en' or another default locale

  useEffect(() => {
    // Only access navigator if in the browser environment
    if (typeof window !== 'undefined') {
      const userLocale = navigator.language === 'ja' ? 'ja' : navigator.language === 'en' ? 'en' : 'eu';
      setLang(userLocale);
    }
  }, []);

  return (
    <div className="flex flex-wrap justify-around">
      <PriceCard title="1 hour lesson" footer={[prices.single[lang]]} />
      <PriceCard title="4 hours lessons" subtitle="3 months" footer={[prices.four[lang], prices.fourBefore[lang]]} />
      <PriceCard title="12 hours lessons" subtitle="6 months" footer={[prices.twelve[lang], prices.twelveBefore[lang]]} />
      <Card className="w-full m-2 transition-transform duration-300 hover:scale-110">
        <CardHeader className="bg-primary-color rounded-t-lg">
          <div className="flex items-center">
            <UsersRound className="text-white mr-2" />
            <CardTitle className="text-white font-bold">Group lesson</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="mt-5">
          <div className="flex items-center">
            <BadgeCheck className="text-primary-color mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <BadgeCheck className="text-primary-color mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <BadgeCheck className="text-primary-color mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
          <div className="flex items-center">
            <BadgeCheck className="text-primary-color mr-2" />
            <TypographyMuted>Providing reference materials as necessary</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end">
          <TypographyLead>{prices.group.two[lang]}/persons for 2 persons</TypographyLead>
          <TypographyLead>{prices.group.three[lang]}/persons for 3 persons</TypographyLead>
          <TypographyLead>{prices.group.four[lang]}/persons for 4 persons</TypographyLead>
        </CardFooter>
      </Card>
    </div>
  );
}
