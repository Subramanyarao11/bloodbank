import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Users,
  Building2,
  Hospital,
  Heart,
  BarChart3,
  Package,
  UserPlus,
  Settings,
  Droplets,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: (typeof UserRole)[keyof typeof UserRole][];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.DONOR, UserRole.HOSPITAL, UserRole.ORGANISATION],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Organizations',
    href: '/organizations',
    icon: Building2,
    roles: [UserRole.ADMIN, UserRole.DONOR, UserRole.HOSPITAL],
  },
  {
    title: 'Hospitals',
    href: '/hospitals',
    icon: Hospital,
    roles: [UserRole.ADMIN, UserRole.ORGANISATION],
  },
  {
    title: 'Donors',
    href: '/donors',
    icon: Heart,
    roles: [UserRole.ADMIN, UserRole.ORGANISATION],
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: [UserRole.ADMIN, UserRole.ORGANISATION, UserRole.HOSPITAL],
  },
  {
    title: 'Create Inventory',
    href: '/inventory/create',
    icon: UserPlus,
    roles: [UserRole.ORGANISATION],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.ORGANISATION],
  },
  {
    title: 'Blood Groups',
    href: '/blood-groups',
    icon: Droplets,
    roles: [UserRole.ADMIN, UserRole.ORGANISATION, UserRole.HOSPITAL],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <div className="pb-12 w-64 bg-card border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 py-2">
            <Droplets className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-foreground">BloodBank</h2>
          </div>
          <div className="space-y-1 mt-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-100'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
