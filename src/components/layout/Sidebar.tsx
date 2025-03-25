import React from 'react';
import { Menu } from '@progress/kendo-react-layout';
import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';
import {
  LayoutDashboard,
  Trophy,
  User,
  BarChart,
  Target,
  Folder,
  LightbulbIcon,
  Users,
  Settings,
  Globe,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const sidebarItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Trophy className="h-5 w-5" />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', href: '/profile' },
    { icon: <BarChart className="h-5 w-5" />, label: 'Reports', href: '/reports' },
    { icon: <Target className="h-5 w-5" />, label: 'Goals', href: '/goals' },
    { icon: <Folder className="h-5 w-5" />, label: 'Projects', href: '/projects' },
    { icon: <LightbulbIcon className="h-5 w-5" />, label: 'Insights', href: '/insights' },
    { icon: <Users className="h-5 w-5" />, label: 'Teams', href: '/teams' },
    { icon: <Globe className="h-5 w-5" />, label: 'Global Progress', href: '/global-progress' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/settings' },
  ];

  const menuItems = sidebarItems.map(item => ({
    text: item.label,
    data: { href: item.href, icon: item.icon },
  }));

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-gray-100 p-4 shadow-lg">
      <div className="space-y-6">
        {/* <div className="py-2">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">Navigation</h2>
        </div> */}
        <Menu
          vertical
          style={{ background: 'transparent' }}
          items={menuItems}
          itemRender={(props) => {
            const { item } = props;
            const isActive = pathname === item.data.href;
            return (
              <Link
                to={item.data.href}
                className={cn(
                  'k-menu-link flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                )}
              >
                {item.data.icon}
                <span className="k-menu-link-text">{item.text}</span>
              </Link>
            );
          }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;