
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: "Leaderboard",
      href: "/leaderboard",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      href: "/profile",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: "Reports",
      href: "/reports",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Goals",
      href: "/goals",
    },
    {
      icon: <Folder className="h-5 w-5" />,
      label: "Projects",
      href: "/projects",
    },
    {
      icon: <LightbulbIcon className="h-5 w-5" />,
      label: "Insights",
      href: "/insights",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Teams",
      href: "/teams",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar p-4">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
