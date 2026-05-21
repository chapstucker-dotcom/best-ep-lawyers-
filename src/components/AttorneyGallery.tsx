import { AttorneyProfile } from '@/data/attorneyTypes';
import { Mail, Phone, Linkedin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AttorneyGalleryProps {
  attorneys: AttorneyProfile[];
}

export function AttorneyGallery({ attorneys }: AttorneyGalleryProps) {
  if (attorneys.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-8">Our Attorneys</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attorneys.map((attorney) => (
          <Card key={attorney.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {attorney.photo_url ? (
                  <img
                    src={attorney.photo_url}
                    alt={attorney.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-3xl text-gray-400">{attorney.name.charAt(0)}</span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-1">{attorney.name}</h3>
                {attorney.title && (
                  <p className="text-sm text-gray-600 mb-3">{attorney.title}</p>
                )}
                
                {attorney.specialties && attorney.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {attorney.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {attorney.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{attorney.bio}</p>
                )}
                
                {attorney.education && attorney.education.length > 0 && (
                  <div className="w-full text-left mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Education</p>
                    {attorney.education.slice(0, 2).map((edu, idx) => (
                      <p key={idx} className="text-xs text-gray-600">{edu}</p>
                    ))}
                  </div>
                )}
                
                {attorney.bar_admissions && attorney.bar_admissions.length > 0 && (
                  <div className="w-full text-left mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Bar Admissions</p>
                    {attorney.bar_admissions.map((bar, idx) => (
                      <p key={idx} className="text-xs text-gray-600">{bar}</p>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  {attorney.email && (
                    <a href={`mailto:${attorney.email}`} className="text-blue-600 hover:text-blue-800">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {attorney.phone && (
                    <a href={`tel:${attorney.phone}`} className="text-blue-600 hover:text-blue-800">
                      <Phone className="w-5 h-5" />
                    </a>
                  )}
                  {attorney.linkedin_url && (
                    <a href={attorney.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
