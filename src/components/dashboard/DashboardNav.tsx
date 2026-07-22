import {
  BarChart3,
  CreditCard,
  LogOut,
  MessageSquare,
  Scale,
  UserRound,
  Users,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

interface DashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserRound,
  },
  {
    id: 'attorneys',
    label: 'Attorneys',
    icon: Users,
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: MessageSquare,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: CreditCard,
  },
];

export function DashboardNav({
  activeTab,
  setActiveTab,
}: DashboardNavProps) {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Unable to sign out:', error);
      return;
    }

    window.location.href = '/';
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1FA8A1]">
                <Scale className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  El Paso&apos;s Best Lawyers
                </h1>

                <p className="text-sm text-gray-500">
                  Firm Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#1FA8A1] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}