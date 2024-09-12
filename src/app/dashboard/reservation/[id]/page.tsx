import React from 'react';

import { TypographyH1 } from '@/components/typography';

export default function ReservationId({ params: { id } }: IdParamsType) {
  return (
    <div>
      <TypographyH1>{id}</TypographyH1>
    </div>
  );
}
