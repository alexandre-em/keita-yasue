'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type BottomNavBarItemProps = {
  name: string;
  path: string;
  icon: React.JSX.Element;
};

export default function BottomNavBarItem(item: BottomNavBarItemProps) {
  const pathname = usePathname();

  const style =
    pathname === item.path ? 'text-[#ff930f]' : ' font-thin text-gray-500 dark:text-gray-400 group-hover:text-[#ff930f]';

  return (
    <Link
      href={item.path}
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <button type="button" className="inline-flex flex-col items-center justify-center">
        <div className={style}>{item.icon}</div>
        <span className={style}>{item.name}</span>
      </button>
    </Link>
  );
}
