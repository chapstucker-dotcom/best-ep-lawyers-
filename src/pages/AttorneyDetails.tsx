import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Scale,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AttorneyRecord {
  id: string;
  firm_id: string;
  name: string;
  title: string | null;
  photo_url: string | null;
  bio: string | null;
  specialties: string[] | null;
  education: string[] | null;
  bar_admissions: string[] | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  is_active: boolean;
}

interface FirmRecord {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  zip_code: string | null;
  logo_url: string | null;
  plan: string | null;
  plan_key: string | null;
}

export default function AttorneyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [attorney, setAttorney] =
    useState<AttorneyRecord | null>(null);
  const [firm, setFirm] =
    useState<FirmRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setErrorMessage('Attorney profile not specified.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      const { data: attorneyData, error: attorneyError } =
        await supabase
          .from('attorney_profiles')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .maybeSingle();

      if (attorneyError) {
        console.error(attorneyError);
        setErrorMessage(attorneyError.message);
        setLoading(false);
        return;
      }

      if (!attorneyData) {
        setErrorMessage('Attorney profile not found.');
        setLoading(false);
        return;
      }

      const loadedAttorney =
        attorneyData as AttorneyRecord;

      setAttorney(loadedAttorney);

      const { data: firmData, error: firmError } =
        await supabase
          .from('firms')
          .select(
            'id, name, phone, email, website, address, city, state, zip, zip_code, logo_url, plan, plan_key'
          )
          .eq('id', loadedAttorney.firm_id)
          .maybeSingle();

      if (firmError) {
        console.error(firmError);
      } else {
        setFirm(firmData as FirmRecord | null);
      }

      setLoading(false);
    };

    void loadProfile();
  }, [id]);

  useEffect(() => {
    if (!attorney) return;

    document.title =
      `${attorney.name} | El Paso's Best Lawyers`;

    return () => {
      document.title =
        "El Paso's Best Lawyers";
    };
  }, [attorney]);

  const externalUrl = (url: string) =>
    url.startsWith('http') ? url : `https://${url}`;

  const fullAddress = firm
    ? [
        firm.address,
        firm.city,
        firm.state,
        firm.zip_code || firm.zip,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          Loading attorney profile...
        </div>
      </main>
    );
  }

  if (!attorney || errorMessage) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="mb-3 text-2xl font-bold">
                Attorney Profile Unavailable
              </h1>

              <p className="mb-6 text-gray-600">
                {errorMessage}
              </p>

              <Button onClick={() => navigate('/')}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#0F2A43] text-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <Button
            type="button"
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0F2A43] to-[#1FA8A1] px-6 py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {attorney.photo_url ? (
                <img
                  src={attorney.photo_url}
                  alt={attorney.name}
                  className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-5xl font-bold text-gray-500">
                  {attorney.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-white">
                <h1 className="text-3xl font-bold sm:text-4xl">
                  {attorney.name}
                </h1>

                {attorney.title && (
                  <p className="mt-2 text-lg text-white/90">
                    {attorney.title}
                  </p>
                )}

                {firm?.name && (
                  <p className="mt-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {firm.name}
                  </p>
                )}

                {(firm?.plan_key || firm?.plan) && (
                  <Badge className="mt-4 bg-[#F5B800] text-[#0F2A43]">
                    {firm.plan_key || firm.plan}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {attorney.phone && (
              <Button
                onClick={() =>
                  window.location.assign(
                    `tel:${attorney.phone}`
                  )
                }
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            )}

            {attorney.email && (
              <Button
                variant="outline"
                onClick={() =>
                  window.location.assign(
                    `mailto:${attorney.email}`
                  )
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            )}

            {attorney.linkedin_url && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    externalUrl(attorney.linkedin_url!),
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            )}

            {firm?.website && (
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    externalUrl(firm.website!),
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Firm Website
              </Button>
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  About {attorney.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-line leading-7 text-gray-700">
                  {attorney.bio ||
                    'A professional biography has not yet been added.'}
                </p>
              </CardContent>
            </Card>

            {!!attorney.specialties?.length && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Areas</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-wrap gap-2">
                  {attorney.specialties.map(
                    (specialty, index) => (
                      <Badge
                        key={`${specialty}-${index}`}
                        variant="secondary"
                      >
                        {specialty}
                      </Badge>
                    )
                  )}
                </CardContent>
              </Card>
            )}

            {!!attorney.education?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {attorney.education.map(
                      (item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="border-b pb-3 last:border-0"
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {!!attorney.bar_admissions?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Bar Admissions
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {attorney.bar_admissions.map(
                      (item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="border-b pb-3 last:border-0"
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <aside>
            <Card>
              <CardHeader>
                <CardTitle>Firm Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {firm?.logo_url && (
                  <img
                    src={firm.logo_url}
                    alt={`${firm.name} logo`}
                    className="h-20 object-contain"
                  />
                )}

                {firm?.name && (
                  <p className="font-semibold">
                    {firm.name}
                  </p>
                )}

                {fullAddress && (
                  <p className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    {fullAddress}
                  </p>
                )}

                {firm?.phone && (
                  <a
                    href={`tel:${firm.phone}`}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Phone className="h-4 w-4" />
                    {firm.phone}
                  </a>
                )}

                {firm?.email && (
                  <a
                    href={`mailto:${firm.email}`}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                    {firm.email}
                  </a>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}