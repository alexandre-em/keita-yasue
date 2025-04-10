import React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { TrendingUpIcon } from 'lucide-react';

type NumberCardProps = {
  data: {
    title: string;
    trendIcon?: boolean;
    value: number;
    footer?: string;
  };
};

export default function NumberCard({ data }: NumberCardProps) {
  return (
    <Card className="min-w-[200px] w-[250px] mx-2">
      <CardHeader className="relative">
        <CardDescription>{data.title}</CardDescription>
        <CardTitle className="@[350px]/card:text-3xl text-2xl font-semibold tabular-nums flex">
          {data.value}
          {data.value > 0 && data.trendIcon && <TrendingUpIcon className="size-3" />}
        </CardTitle>
      </CardHeader>
      {data.footer && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">{data.footer}</div>
        </CardFooter>
      )}
    </Card>
  );
}
