import React from 'react';

import ServerDownSvg from '@/components/svg/ServerDown';

export default function ErrorPage() {
  return (
    <div className="h-[calc(100dvh-57px)] flex flex-col justify-center items-center">
      <ServerDownSvg width={300} height={200} />
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-primary-color mt-2 lg:text-5xl">Page Not Found</h1>
      <div className="absolute bg-[#b07edf] w-[100px] h-[100px] top-[-20px] left-2 rounded-full opacity-30 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10dvw] h-[10dvw] max-h-[250px] max-w-[250px] top-72 left-72 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[30px] h-[30px] bottom-48 left-36 rounded-full opacity-70 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[10px] h-[10px] top-28 right-36 rounded-full opacity-50 z-[-999]"></div>
      <div className="absolute bg-primary-color w-[50dvw] h-[50dvw] max-h-[500px] max-w-[500px] bottom-0 right-5 rounded-full opacity-10 z-[-999]"></div>
    </div>
  );
}
