import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Phone, Mail, Globe, MapPin, Star } from 'lucide-react';
import { Firm } from '../data/types';
import { trackEvent } from '@/services/analyticsService';

interface FirmCardProps {
  firm: Firm;
  onClick: () => void;
}

export default function FirmCard({ firm, onClick }: FirmCardProps) {
  const handlePhoneClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await trackEvent(firm.id, 'click_phone');
    window.location.href = `tel:${firm.phone}`;
  };

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firm.email) {
      await trackEvent(firm.id, 'click_email');
      window.location.href = `mailto:${firm.email}`;
    }
  };

  const handleWebsiteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (firm.website) {
      await trackEvent(firm.id, 'click_website');
      window.open(firm.website, '_blank');
    }
  };

  const handleCardClick = async () => {
    await trackEvent(firm.id, 'view');
    onClick();
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={handleCardClick}>
      <div className="h-40 bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] relative">
        {firm.logo_url && (
          <img src={firm.logo_url} alt={`${firm.name} office`} className="w-full h-full object-cover" />
        )}
        {firm.is_featured && (
          <Badge className="absolute top-3 right-3 bg-[#F5B800] text-[#0F2A43]">Featured</Badge>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {firm.logo_url && (
            <img src={firm.logo_url} alt={`${firm.name} logo`} className="w-16 h-16 rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#0F2A43] mb-1">{firm.name}</h3>
            {firm.is_verified && (
              <Badge variant="outline" className="text-xs">Verified</Badge>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{firm.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {firm.specialties?.slice(0, 3).map((specialty, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          {firm.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <button onClick={handlePhoneClick} className="hover:text-[#1FA8A1] transition-colors">
                {firm.phone}
              </button>
            </div>
          )}
          {firm.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{firm.city}, {firm.state}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button className="flex-1 bg-[#1FA8A1] hover:bg-[#1FA8A1]/90">
            View Profile
          </Button>
          {firm.website && (
            <Button variant="outline" size="icon" onClick={handleWebsiteClick}>
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}


