import { getUserDetail } from '@/constants/cookies';
import { adminMenu, userMenu } from '../Sidebar';
import BottomNavBarItem from './BottomSideBarItem';
import { Ghost, LogOutIcon } from 'lucide-react';
import googleAuthInstance from '@/lib/auth';
import { toast } from 'sonner';

export default async function BottomNavBar() {
  const user = await getUserDetail();

  const menu = (user.role === 'ADMIN' ? adminMenu : userMenu).flatMap((item) => item.projects);

  const handleLogOff = async () => {
    await googleAuthInstance.signOut();

    toast('See you soon !', {
      description: 'You have been successfully logged out',
      icon: <Ghost />,
    });
  };

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 md:invisible block">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto text-xs">
        {menu.map((item, i) => i < 4 && <BottomNavBarItem {...item} key={`bottom-${item.name}`} />)}
        <BottomNavBarItem name="Logout" path="/logout" icon={<LogOutIcon />}  />
        <div
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
      <button type="button" className="inline-flex flex-col items-center justify-center" onClick={handleLogOff}>
        <div className="text-[#ff930f]"><LogOutIcon /></div>
        <span className="text-[#ff930f]">Logout</span>
      </button>
        </div>
      </div>
    </div>
  );
}
