import React from 'react';
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

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-gray-100 p-4 shadow-lg">
      <div className="space-y-6">
        <nav className="flex flex-col space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#014D71] text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-[#014D71]'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;