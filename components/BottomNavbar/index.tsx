import { getUserDetail } from '@/constants/cookies';
import { adminMenu, userMenu } from '../Sidebar';
import { headers } from 'next/headers';
import BottomNavBarItem from './BottomSideBarItem';

export default async function BottomNavBar() {
  const user = await getUserDetail();
  const heads = await headers();
  const pathname = heads.values();

  console.log(pathname);

  const menu = (user.role === 'ADMIN' ? adminMenu : userMenu).flatMap((item) => item.projects);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 md:invisible block">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto text-xs">
        {menu.map((item, i) => i < 4 && <BottomNavBarItem {...item} key={`bottom-${item.name}`} />)}
      </div>
    </div>
  );
}
