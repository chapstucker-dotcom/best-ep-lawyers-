import {
  useState,
  type FormEvent,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Send,
  UserRound,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

interface LeadCaptureFormProps {
  firmId?: string;
  firmName?: string;
  firmEmail?: string | null;
  practiceArea?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  variant?: 'default' | 'homepage';
  phoneOptional?: boolean;
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  legalIssue: string;
};

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  legalIssue: '',
};

const PRACTICE_AREA_NAMES: Record<string, string> = {
  'personal-injury': 'Personal Injury',
  'car-accident': 'Car Accident',
  'truck-accident': 'Truck Accident',
  'motorcycle-accident': 'Motorcycle Accident',
  'construction-accident': 'Construction Accident',
  'slip-and-fall': 'Slip and Fall',
  'wrongful-death': 'Wrongful Death',
  'workers-compensation': "Workers' Compensation",
  'workplace-discrimination': 'Workplace Discrimination',
  'wage-hour': 'Wage and Hour',
  'traffic-ticket': 'Traffic Ticket',
  'criminal-defense': 'Criminal Defense',
  immigration: 'Immigration',
  'family-law': 'Family Law',
  divorce: 'Divorce',
  'estate-planning': 'Estate Planning',
  probate: 'Probate',
  'business-law': 'Business Law',
  business: 'Business Law',
  'real-estate': 'Real Estate',
  'employment-law': 'Employment Law',
  employment: 'Employment Law',
  bankruptcy: 'Bankruptcy',
  'civil-litigation': 'Civil Litigation',
  dwi: 'DWI / DUI',
  dui: 'DWI / DUI',
  'dwi-dui': 'DWI / DUI',
};

const formatPracticeAreaSlug = (
  slug: string
): string => {
  if (PRACTICE_AREA_NAMES[slug]) {
    return PRACTICE_AREA_NAMES[slug];
  }

  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();

      if (lower === 'dwi' || lower === 'dui') {
        return lower.toUpperCase();
      }

      return (
        lower.charAt(0).toUpperCase() +
        lower.slice(1)
      );
    })
    .join(' ');
};

const inferPracticeAreaFromUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'General Legal Inquiry';
  }

  let pathname = window.location.pathname
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!pathname) {
    return 'General Legal Inquiry';
  }

  /*
   * Handles URLs such as:
   * /el-paso-personal-injury-lawyers
   * /el-paso-workers-compensation-lawyers
   */
  if (pathname.startsWith('el-paso-')) {
    pathname = pathname.replace(
      /^el-paso-/,
      ''
    );

    pathname = pathname.replace(
      /-lawyers?$/,
      ''
    );

    return formatPracticeAreaSlug(pathname);
  }

  /*
   * Handles category URLs such as:
   * /category/immigration
   */
  if (pathname.startsWith('category/')) {
    const slug =
      pathname.split('/').filter(Boolean).pop() ||
      '';

    if (slug) {
      return formatPracticeAreaSlug(slug);
    }
  }

  return 'General Legal Inquiry';
};

const isMissingColumnError = (
  error: {
    code?: string;
    message?: string;
  } | null
): boolean => {
  if (!error) return false;

  return (
    error.code === '42703' ||
    error.code === 'PGRST204' ||
    Boolean(
      error.message
        ?.toLowerCase()
        .includes('column')
    )
  );
};

export default function LeadCaptureForm({
  firmId,
  firmName,
  firmEmail,
  practiceArea,
  title,
  description,
  onSuccess,
  variant = 'default',
  phoneOptional = false,
}: LeadCaptureFormProps) {
  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  /*
   * Prefer a practice area explicitly supplied by a
   * firm/profile page. Otherwise determine it from
   * the URL automatically.
   */
  const effectivePracticeArea =
    practiceArea?.trim() ||
    inferPracticeAreaFromUrl();

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = (): string => {
    if (form.fullName.trim().length < 2) {
      return 'Enter your full name.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return 'Enter a valid email address.';
    }

    if (
      !phoneOptional &&
      form.phone.trim().length < 7
    ) {
      return 'Enter a valid phone number.';
    }

    if (
      phoneOptional &&
      form.phone.trim().length > 0 &&
      form.phone.trim().length < 7
    ) {
      return 'Enter a valid phone number or leave it blank.';
    }

    if (form.legalIssue.trim().length < 10) {
      return 'Please briefly describe how a lawyer may be able to help.';
    }

    return '';
  };

  const saveLead = async () => {
    const baseLead = {
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      legal_issue: form.legalIssue.trim(),
    };

    /*
     * First try to save the complete lead record.
     */
    const enrichedLead = {
      ...baseLead,
      firm_id: firmId || null,
      firm_name: firmName || null,
      practice_area:
        effectivePracticeArea ||
        'General Legal Inquiry',
      status: 'new',
    };

    const firstAttempt = await supabase
      .from('leads')
      .insert([enrichedLead]);

    if (!firstAttempt.error) {
      return firstAttempt;
    }

    /*
     * If the existing Supabase table does not yet
     * contain the newer tracking columns, keep the
     * lead instead of losing it.
     */
    if (
      isMissingColumnError(firstAttempt.error)
    ) {
      return supabase
        .from('leads')
        .insert([baseLead]);
    }

    return firstAttempt;
  };

  const sendLeadNotification = async () => {
    try {
      const response = await fetch(
        '/api/send-lead',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            fullName:
              form.fullName.trim(),

            email:
              form.email.trim(),

            phone:
              form.phone.trim(),

            legalIssue:
              form.legalIssue.trim(),

            firmId:
              firmId || null,

            firmName:
              firmName || null,

            firmEmail:
              firmEmail || null,

            practiceArea:
              effectivePracticeArea,

            sourceUrl:
              typeof window !== 'undefined'
                ? window.location.href
                : null,
          }),
        }
      );

      if (!response.ok) {
        console.warn(
          'Lead saved, but email notification was not delivered.',
          response.status
        );
      }
    } catch (error) {
      /*
       * The lead is already stored.
       * Email failure must not lose it.
       */
      console.warn(
        'Lead notification request failed:',
        error
      );
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await saveLead();

      if (error) {
        throw error;
      }

      await sendLeadNotification();

      /*
       * Do not claim that a specific firm has
       * received the inquiry. The platform captures
       * the lead first.
       */
      setSuccessMessage(
        "Your consultation request was submitted successfully. El Paso's Best Lawyers has received your request."
      );

      setForm(EMPTY_FORM);

      onSuccess?.();
    } catch (error) {
      console.error(
        'Lead submission failed:',
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Your request could not be submitted. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formTitle =
    title ||
    (firmName
      ? `Contact ${firmName}`
      : 'Request a Consultation');

  const formDescription =
    description ||
    'Share a few details about your legal matter. Submitting this form does not create an attorney-client relationship.';

  if (variant === 'homepage') {
    return (
      <section
        id="lead-form"
        className="overflow-hidden rounded-[28px] border border-[#1FA8A1]/35 bg-[#071D2F] shadow-2xl"
      >
        <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
          <div className="border-b border-white/10 p-7 text-white sm:p-9 lg:border-b-0 lg:border-r">
            <p className="text-sm font-black uppercase tracking-widest text-[#F5B800]">
              Tell Us About Your Legal Issue
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              {formTitle}
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-300">
              {formDescription}
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div>
                <p className="font-bold text-white">
                  Local legal options
                </p>
                <p className="mt-1 text-slate-400">
                  Your inquiry helps us understand the type of legal help you are looking for.
                </p>
              </div>

              <div>
                <p className="font-bold text-white">
                  Your information is protected
                </p>
                <p className="mt-1 text-slate-400">
                  Do not include confidential or highly sensitive information.
                </p>
              </div>

              <div>
                <p className="font-bold text-white">
                  Simple and direct
                </p>
                <p className="mt-1 text-slate-400">
                  Share the basics so the right legal category can be identified.
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-9">
            {successMessage && (
              <Alert className="mb-6 border-green-300 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert
                variant="destructive"
                className="mb-6"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="homepage-legal-issue"
                  className="text-base font-bold text-white"
                >
                  What&apos;s your legal issue? *
                </Label>

                <Textarea
                  id="homepage-legal-issue"
                  value={form.legalIssue}
                  onChange={(event) =>
                    updateField(
                      'legalIssue',
                      event.target.value
                    )
                  }
                  placeholder="e.g. car accident, divorce, DWI, immigration, business dispute..."
                  rows={5}
                  maxLength={1000}
                  className="border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-[#D4A62A]"
                  disabled={loading}
                  required
                />

                <p className="text-right text-xs text-slate-500">
                  {form.legalIssue.length}/1000
                </p>
              </div>

              <div>
                <p className="mb-3 font-bold text-white">
                  Your Contact Information
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="homepage-full-name"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField(
                          'fullName',
                          event.target.value
                        )
                      }
                      placeholder="Full Name"
                      autoComplete="name"
                      className="border-white/15 bg-white/10 pl-10 text-white placeholder:text-slate-400"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="homepage-email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          'email',
                          event.target.value
                        )
                      }
                      placeholder="Email Address"
                      autoComplete="email"
                      className="border-white/15 bg-white/10 pl-10 text-white placeholder:text-slate-400"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="relative md:col-span-2">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="homepage-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          'phone',
                          event.target.value
                        )
                      }
                      placeholder={
                        phoneOptional
                          ? 'Phone Number (Optional)'
                          : 'Phone Number'
                      }
                      autoComplete="tel"
                      className="border-white/15 bg-white/10 pl-10 text-white placeholder:text-slate-400"
                      disabled={loading}
                      required={!phoneOptional}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs leading-5 text-slate-400">
                By submitting, you understand that this does not create an attorney-client relationship and does not guarantee representation.
              </p>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-[#D4A62A] text-base font-black text-[#061A2C] hover:bg-[#E3B53A]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send My Info
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="lead-form"
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <div className="bg-gradient-to-r from-[#0F2A43] to-[#176B78] px-6 py-6 text-white sm:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-[#F5B800]">
          Legal Help
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {formTitle}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          {formDescription}
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {successMessage && (
          <Alert className="mb-6 border-green-300 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4" />

            <AlertDescription>
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert
            variant="destructive"
            className="mb-6"
          >
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-full-name">
                Full Name *
              </Label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  id="lead-full-name"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField(
                      'fullName',
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  className="pl-10 text-slate-900"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-email">
                Email Address *
              </Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  id="lead-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="pl-10 text-slate-900"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="lead-phone">
                Phone Number *
              </Label>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  id="lead-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="(915) 555-1234"
                  autoComplete="tel"
                  className="pl-10 text-slate-900"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-legal-issue">
              How can a lawyer help? *
            </Label>

            <Textarea
              id="lead-legal-issue"
              value={form.legalIssue}
              onChange={(event) =>
                updateField(
                  'legalIssue',
                  event.target.value
                )
              }
              placeholder="Briefly describe your legal issue, important dates, and the type of help you are seeking."
              rows={6}
              className="text-slate-900"
              disabled={loading}
              required
            />

            <p className="text-xs text-gray-500">
              Do not include confidential or highly
              sensitive information.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-[#1FA8A1] text-base font-semibold hover:bg-[#178D87]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Request Consultation
              </>
            )}
          </Button>

          <p className="text-center text-xs leading-5 text-gray-500">
            Submission does not guarantee representation
            and does not create an attorney-client
            relationship.
          </p>
        </form>
      </div>
    </section>
  );
}
