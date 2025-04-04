'use client';
import React from 'react';

import { Card, CardContent, CardHeader } from './ui/card';
import { TypographyBold, TypographyH4, TypographyMuted, TypographySmall } from './typography';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

type LangEnum = 'ja' | 'eu' | 'en';

const prices = [
  {
    title: '1 hour lesson',
    price: {
      ja: `¥3,000`,
      en: '£20',
      eu: '25€',
    },
    from: 'from-[#f7fdff]',
    to: 'to-[#f7fdff] text-black',
  },
  {
    title: '4 hours lessons',
    price: {
      ja: '¥11,000',
      en: '£70',
      eu: '90€',
    },
    oldPrice: {
      ja: '¥12,000',
      en: '£80',
      eu: '100€',
    },
    from: 'from-[#dfecf2]',
    to: 'to-[#deb0f5]',
  },
  {
    title: '12 hours lessons',
    price: {
      ja: '¥30,000',
      en: '£200',
      eu: '250€',
    },
    oldPrice: {
      ja: '¥36,800',
      en: '£240',
      eu: '300€',
    },
    from: 'from-[#f5b0cf]',
    to: 'to-[#ffdd8f]',
  },
];

const group = {
  title: 'Group lesson',
  prices: {
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
  oldPrices: {
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
  from: 'from-[#ffb303]',
  to: 'to-[#ed6f2f]',
};

type PriceCardProps = {
  title: string;
  subtitle?: string;
  price: string;
  oldPrice?: string;
  from: string;
  to: string;
};

export function PricingCard({ title, subtitle, price, oldPrice, from, to }: PriceCardProps) {
  return (
    <Card className="w-[350px] min-h-[550px] m-2">
      <CardHeader className={`flex h-[60px] mx-4 justify-center items-center text-white rounded-sm bg-linear-65 ${from} ${to}`}>
        <TypographyH4>{title.toUpperCase()}</TypographyH4>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center my-20">
          <div className="flex flex-col items-center">
            {oldPrice && (
              <div className="opacity-40 line-through mr-1">
                <TypographyMuted>
                  <p className="text-lg">{oldPrice}</p>
                </TypographyMuted>
              </div>
            )}
            <div className="text-5xl font-bold">{price}</div>
          </div>
          <div className="text-lg">{subtitle}</div>
        </div>
        <div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>In-person lessons or in visio</TypographyBold>
          </div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>Audio, video and text resources</TypographyBold>
          </div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>Review at the end of the lesson</TypographyBold>
          </div>
          <Button className="w-full h-[50px] mt-5">Get started</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function GroupPricingCard() {
  const [lang, setLang] = React.useState<LangEnum>('en'); // Default to 'en' or another default locale
  const [person, setPerson] = React.useState<'two' | 'three' | 'four'>('two');

  React.useEffect(() => {
    // Only access navigator if in the browser environment
    if (typeof window !== 'undefined') {
      const userLocale = navigator.language === 'ja' ? 'ja' : navigator.language === 'en' ? 'en' : 'eu';
      setLang(userLocale);
    }
  }, []);

  return (
    <Card className="w-[350px] min-h-[550px] m-2">
      <CardHeader className="flex h-[60px] mx-4 justify-center items-center bg-linear-65 from-[#ffb303] to-[#db655a] text-white rounded-sm">
        <TypographyH4>{group.title.toUpperCase()}</TypographyH4>
      </CardHeader>
      <CardContent>
        <Select value={person} onValueChange={(value) => setPerson(value as 'two' | 'three' | 'four')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group size</SelectLabel>
              <SelectItem value="two">2 persons</SelectItem>
              <SelectItem value="three">3 persons</SelectItem>
              <SelectItem value="four">4 persons</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-col justify-center items-center my-20">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold">{group.prices[person][lang]}</div>
            <TypographySmall>/persons</TypographySmall>
          </div>
        </div>
        <div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>In-person lessons or in visio</TypographyBold>
          </div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>Audio, video and text resources</TypographyBold>
          </div>
          <div className="flex items-center my-2">
            <Check className="mr-3" />
            <TypographyBold>Review at the end of the lesson</TypographyBold>
          </div>
          <Button className="w-full h-[50px] mt-5">Contact me</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PricingCardCarousel() {
  const [lang, setLang] = React.useState<LangEnum>('en'); // Default to 'en' or another default locale

  React.useEffect(() => {
    // Only access navigator if in the browser environment
    if (typeof window !== 'undefined') {
      const userLocale = navigator.language === 'ja' ? 'ja' : navigator.language === 'en' ? 'en' : 'eu';
      setLang(userLocale);
    }
  }, []);

  return (
    <div className="flex w-full overflow-auto">
      {prices.map((price, index) => (
        <div className="p-1" key={`card-carousel-price-${price.title}-${index}`}>
          <PricingCard
            title={price.title}
            oldPrice={price.oldPrice ? price.oldPrice[lang] : undefined}
            price={price.price[lang]}
            from={price.from}
            to={price.to}
          />
        </div>
      ))}
      <div className="p-1">
        <GroupPricingCard />
      </div>
    </div>
  );
}
