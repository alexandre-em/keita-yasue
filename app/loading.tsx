import { TypographyLead } from '@/components/typography';
import React from 'react';

export default function LoadingPage() {
  return (
    <div className="bg-[#f8f8f8] flex flex-col justify-center items-center w-dvw h-dvh">
      <img src="/loading.png" alt="" className="w-[250px] h-[225px]" />
      <TypographyLead>Loading...</TypographyLead>
    </div>
  );
}
