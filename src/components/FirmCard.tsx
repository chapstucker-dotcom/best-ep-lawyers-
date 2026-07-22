import type { MouseEvent } from 'react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

import {
  Building2,
  CheckCircle2,
  Globe,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';

import type { Firm } from '../data/types';
import { trackEvent } from '@/services/analyticsService';

interface FirmCardProps {
  firm: Firm;
  onClick: () => void;
}

type PublicFirm = Firm & {
  logo?: string | null;
  logo_url?: string | null;
  description?: string | null;
  blurb?: string | null;
  specialties?: string[] | null;
  categories?: string[] | null;
  is_featured?: boolean | null;
  featured?: boolean | null;
  is_verified?: boolean | null;
  plan?: string | null;
};

export default function FirmCard({
  firm,
  onClick,
}: FirmCardProps) {
  const publicFirm = firm as PublicFirm;

  const logo =
    publicFirm.logo_url ||
    publicFirm.logo ||
    '';

  const description =
    publicFirm.description?.trim() ||
    publicFirm.blurb?.trim() ||
    'View this firm’s profile, attorneys, practice areas, and contact information.';

  const practiceAreas =
    publicFirm.specialties?.length
      ? publicFirm.specialties
      : publicFirm.categories || [];

  const isFeatured =
    Boolean(publicFirm.is_featured) ||
    Boolean(publicFirm.featured);

  const isVerified =
    Boolean(publicFirm.is_verified);

  const planName =
    publicFirm.plan?.trim() || '';

  const formattedPhone = firm.phone || '';

  const location = [firm.city, firm.state]
    .filter(Boolean)
    .join(', ');

  const handlePhoneClick = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (!firm.phone) return;

    try {
      await trackEvent(firm.id, 'click_phone');
    } catch (error) {
      console.error('Unable to track phone click:', error);
    }

    window.location.href = `tel:${firm.phone}`;
  };

  const handleWebsiteClick = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (!firm.website) return;

    try {
      await trackEvent(firm.id, 'click_website');
    } catch (error) {
      console.error('Unable to track website click:', error);
    }

    const websiteUrl = firm.website.startsWith('http')
      ? firm.website
      : `https://${firm.website}`;

    window.open(
      websiteUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCardClick = async () => {
    try {
      await trackEvent(firm.id, 'view');
    } catch (error) {
      console.error('Unable to track profile view:', error);
    }

    onClick();
  };

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-[#1FA8A1]/40 hover:shadow-xl"
      onClick={handleCardClick}
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F2A43] via-[#176B78] to-[#1FA8A1]">
        {logo ? (
          <img
            src={logo}
            alt={`${firm.name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <Building2 className="h-10 w-10 text-white" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isFeatured && (
            <Badge className="border-0 bg-[#F5B800] text-[#0F2A43] shadow-sm">
              <Star className="mr-1 h-3.5 w-3.5 fill-current" />
              Featured
            </Badge>
          )}

          {planName && planName !== 'free' && planName !== 'basic' && (
            <Badge className="border border-white/30 bg-white/90 text-[#0F2A43]">
              {planName}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold leading-tight text-[#0F2A43]">
            {firm.name}
          </h3>

          {isVerified && (
            <span
              className="shrink-0"
              title="Verified firm"
            >
              <CheckCircle2 className="h-5 w-5 text-[#1FA8A1]" />
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>

        {practiceAreas.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {practiceAreas
              .slice(0, 3)
              .map((practiceArea, index) => (
                <Badge
                  key={`${practiceArea}-${index}`}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {practiceArea}
                </Badge>
              ))}

            {practiceAreas.length > 3 && (
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                +{practiceAreas.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="mb-5 space-y-3 text-sm text-gray-600">
          {firm.phone && (
            <button
              type="button"
              onClick={handlePhoneClick}
              className="flex items-center gap-2 text-left transition hover:text-[#1FA8A1]"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>{formattedPhone}</span>
            </button>
          )}

          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            type="button"
            className="flex-1 bg-[#1FA8A1] hover:bg-[#178D87]"
            onClick={(event) => {
              event.stopPropagation();
              void handleCardClick();
            }}
          >
            View Profile
          </Button>

          {firm.website && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleWebsiteClick}
              aria-label={`Visit ${firm.name} website`}
              title="Visit website"
            >
              <Globe className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}