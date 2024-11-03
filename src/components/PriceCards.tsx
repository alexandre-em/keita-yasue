'use client';
import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
      ja: '¥2600',
      en: '£14.3',
      eu: '17€',
    },
    four: {
      ja: '¥2500',
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
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>1 hour lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <TypographyLead>{prices.single[lang]}</TypographyLead>
        </CardFooter>
      </Card>
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>Group lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Providing reference materials as necessary</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <TypographyLead>{prices.group.two[lang]}/persons for 2 persons</TypographyLead>
        </CardFooter>
      </Card>
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>Group lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Providing reference materials as necessary</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <TypographyLead>{prices.group.three[lang]}/persons for 3 persons</TypographyLead>
        </CardFooter>
      </Card>
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>Group lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Providing reference materials as necessary</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <TypographyLead>{prices.group.four[lang]}/persons for 4 persons</TypographyLead>
        </CardFooter>
      </Card>
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>12 lessons in 6 months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <div className="opacity-40 line-through mr-1">
            <TypographyMuted>{prices.twelveBefore[lang]}</TypographyMuted>
          </div>
          <TypographyLead>{prices.twelve[lang]}</TypographyLead>
        </CardFooter>
      </Card>
      <Card className="md:max-w-80 w-full m-1">
        <CardHeader>
          <CardTitle>4 lessons in 3 months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>In-person lessons or in visio</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Audio, video and text resources</TypographyMuted>
          </div>
          <div className="flex items-center">
            <Check className="text-muted-foreground mr-2" />
            <TypographyMuted>Review at the end of the lesson</TypographyMuted>
          </div>
        </CardContent>
        <CardFooter>
          <div className="opacity-40 line-through mr-1">
            <TypographyMuted>{prices.fourBefore[lang]}</TypographyMuted>
          </div>
          <TypographyLead>{prices.four[lang]}</TypographyLead>
        </CardFooter>
      </Card>
    </div>
  );
}
