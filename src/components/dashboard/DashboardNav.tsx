import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Scale, User, BarChart3, CreditCard, LogOut, Users, MessageSquare } from 'lucide-react';

export const DashboardNav = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'attorneys', label: 'Attorneys', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-[#1FA8A1]" />
            <span className="text-xl font-bold">LawFirm Directory</span>
          </Link>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        <div className="flex space-x-1 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button 
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'} 
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'bg-[#1FA8A1] hover:bg-[#1FA8A1]/90' : ''}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};


