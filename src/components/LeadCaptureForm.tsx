import {
  useState,
  useEffect,
  useRef,
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

import { trackMetaLead } from '@/services/metaPixel';
import { getLeadAttribution } from '@/services/leadAttribution';
import {
  getPracticeAreaByValue,
  resolvePracticeAreaPage,
} from '@/data/platformModel';

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
  locale?: "en" | "es";
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  legalIssue: string;
  matterLocation: string;
  matterTiming: string;
};

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  legalIssue: '',
  matterLocation: '',
  matterTiming: '',
};

const TURNSTILE_SITE_KEY = '0x4AAAAAAF1rD3_kl_i-tVxx';

type TurnstileAPI = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileAPI; }
}

function LeadTurnstile({ onToken, resetKey }: {
  onToken: (token: string | null) => void;
  resetKey: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callback = useRef(onToken);
  callback.current = onToken;

  useEffect(() => {
    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !container.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'auto',
        callback: (token: string) => callback.current(token),
        'expired-callback': () => callback.current(null),
        'error-callback': () => callback.current(null),
      });
    };
    if (!document.querySelector('script[data-epbl-turnstile]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.epblTurnstile = 'true';
      document.head.appendChild(script);
    }
    const poll = window.setInterval(renderWidget, 150);
    renderWidget();
    return () => {
      cancelled = true;
      window.clearInterval(poll);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      callback.current(null);
    }
  }, [resetKey]);
  return <div ref={container} aria-label="Security verification" />;
}

const GENERAL_LEGAL_INQUIRY = 'General Legal Inquiry';

const resolveCanonicalPracticeArea = (
  value: string | null | undefined
): string => {
  const practiceArea = getPracticeAreaByValue(value);

  if (practiceArea) {
    return practiceArea.title;
  }

  return GENERAL_LEGAL_INQUIRY;
};

const inferPracticeAreaFromUrl = (): string => {
  if (typeof window === 'undefined') {
    return GENERAL_LEGAL_INQUIRY;
  }

  const { practiceArea, market } =
    resolvePracticeAreaPage(
      window.location.pathname,
      null
    );

  if (practiceArea) {
    return practiceArea.title;
  }

  if (market) {
    return market.name;
  }

  const pathname = window.location.pathname
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (pathname.startsWith('category/')) {
    const slug =
      pathname.split('/').filter(Boolean).pop() ||
      '';

    return resolveCanonicalPracticeArea(slug);
  }

  return GENERAL_LEGAL_INQUIRY;
};

const inferPracticeAreaFromLegalIssue = (
  legalIssue: string
): string => {
  const text = legalIssue
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 'General Legal Inquiry';

  const rules: Array<{ area: string; terms: string[] }> = [
    { area: 'DWI / DUI', terms: ['dwi', 'dui', 'drunk driving', 'driving while intoxicated', 'driving under the influence'] },
    { area: 'Family Law', terms: ['family law', 'divorce', 'child custody', 'custody', 'child support', 'spousal support', 'alimony', 'adoption', 'paternity'] },
    { area: 'Immigration', terms: ['immigration', 'visa', 'green card', 'citizenship', 'deportation', 'asylum', 'naturalization'] },
    { area: 'Bankruptcy', terms: ['bankruptcy', 'chapter 7', 'chapter 13', 'debt relief'] },
    { area: 'Employment Law', terms: ['employment law', 'wrongful termination', 'wrongfully terminated', 'workplace discrimination', 'employment discrimination', 'workplace harassment', 'unpaid wages', 'overtime pay', 'wage and hour', 'fired from work'] },
    { area: 'Personal Injury', terms: ['personal injury', 'car accident', 'auto accident', 'vehicle accident', 'truck accident', 'motorcycle accident', 'slip and fall', 'wrongful death', 'injured in an accident', 'injury claim'] },
    { area: 'Criminal Defense', terms: ['criminal defense', 'criminal charge', 'criminal charges', 'felony', 'misdemeanor', 'arrested', 'probation violation', 'criminal case'] },
    { area: 'Probate', terms: ['probate', 'executor', 'estate administration', 'inheritance dispute', 'heir', 'heirs'] },
    { area: 'Estate Planning', terms: ['estate planning', 'last will', 'living will', 'living trust', 'revocable trust', 'power of attorney', 'create a trust', 'make a will'] },
    { area: 'Real Estate', terms: ['real estate', 'property dispute', 'landlord', 'tenant', 'lease dispute', 'title dispute', 'deed', 'boundary dispute'] },
    { area: 'Business Law', terms: ['business law', 'business dispute', 'business contract', 'corporate', 'corporation', 'llc', 'partnership dispute', 'company dispute'] },
    { area: 'Civil Litigation', terms: ['civil litigation', 'civil lawsuit', 'civil case', 'being sued', 'file a lawsuit', 'lawsuit against'] },
  ];

  for (const rule of rules) {
    if (rule.terms.some((term) => text.includes(term))) {
      const practiceArea =
        getPracticeAreaByValue(rule.area);

      if (practiceArea) {
        return practiceArea.title;
      }

      return rule.area;
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
  locale = "en",
}: LeadCaptureFormProps) {
  const es = locale === "es";
  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] =
    useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

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
    variant === 'homepage'
      ? inferPracticeAreaFromLegalIssue(form.legalIssue)
      : practiceArea?.trim() ||
        inferPracticeAreaFromUrl();

  type InquiryRecipient = {
    id: string; name: string; tier: "gold" | "silver" | "expert";
    freeConsultation: boolean;
  };
  const [recipients, setRecipients] = useState<InquiryRecipient[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sharingConsent, setSharingConsent] = useState(false);
  const [loadedKey, setLoadedKey] = useState("");
  const [recipientError, setRecipientError] = useState(false);
  const recipientKey = JSON.stringify([effectivePracticeArea, firmId || ""]);

  useEffect(() => {
    const controller = new AbortController();
    setRecipients([]);
    setSelectedIds([]);
    setSharingConsent(false);
    setLoadedKey("");
    setRecipientError(false);
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          action: "eligible-firms", practiceArea: effectivePracticeArea,
        });
        if (firmId) params.set("firmId", firmId);
        const response = await fetch("/api/send-lead?" + params, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || data.success !== true || !Array.isArray(data.firms)) throw Error("Recipients unavailable");
        if (controller.signal.aborted) return;
        setRecipients(data.firms);
        setLoadedKey(recipientKey);
      } catch {
        if (!controller.signal.aborted) {
          setRecipientError(true);
          setLoadedKey(recipientKey);
        }
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [recipientKey, effectivePracticeArea, firmId]);

  const selectRecipients = (ids: string[]) => {
    setSelectedIds(ids);
    setSharingConsent(false);
  };
  const recipientSelection = (
    <div className="space-y-3 rounded-xl border border-slate-300 bg-white p-4 text-slate-900">
      <h3 className="font-semibold">{es ? "Elija los despachos que desea contactar" : "Choose which law firms to contact"}</h3>
      {loadedKey !== recipientKey ? (
        <p className="text-sm">{es ? "Buscando despachos participantes..." : "Checking participating law firms..."}</p>
      ) : recipients.length ? (
        <>
          {!firmId && (
            <button type="button" className="text-sm font-semibold text-teal-700 underline" disabled={loading}
              onClick={() => selectRecipients(selectedIds.length === recipients.length ? [] : recipients.map(firm => firm.id))}>
              {selectedIds.length === recipients.length ? (es ? "Deseleccionar todos" : "Deselect all") : (es ? "Seleccionar todos" : "Select all matching firms")}
            </button>
          )}
          {recipients.map(firm => (
            <label key={firm.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
              <input type="checkbox" className="mt-1" disabled={loading}
                checked={selectedIds.includes(firm.id)}
                onChange={event => selectRecipients(event.target.checked
                  ? [...selectedIds, firm.id] : selectedIds.filter(id => id !== firm.id))} />
              <span>
                <span className="block font-semibold">{firm.name}</span>
                <span className="block text-xs text-slate-600">{firm.tier === "gold" ? "Gold" : firm.tier === "silver" ? "Silver" : "Expert"} {es ? "publicidad" : "advertising placement"}</span>
                {firm.freeConsultation && <span className="block text-xs text-teal-700">{es ? "Consulta inicial gratuita" : "Free initial consultation"}</span>}
              </span>
            </label>
          ))}
          <p className="text-xs text-slate-600">{es ? "Las categorías publicitarias no son recomendaciones." : "Advertising placements are not recommendations."}</p>
        </>
      ) : (
        <p className="text-sm">{recipientError
          ? (es ? "No se pudo consultar la disponibilidad. Puede enviar su solicitud solo a EPBL." : "Firm availability could not be checked. You may submit to EPBL only.")
          : (es ? "No hay despachos participantes disponibles. Su solicitud se enviará solo a EPBL." : "No participating firms are available. Your request will go to EPBL only.")}</p>
      )}
      {selectedIds.length > 0 ? (
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1" checked={sharingConsent} disabled={loading}
            onChange={event => setSharingConsent(event.target.checked)} />
          <span>{es
            ? "Autorizo a El Paso's Best Lawyers a compartir mi nombre, datos de contacto, descripción, lugar y fecha del asunto con los despachos que seleccioné para que puedan evaluar mi solicitud y contactarme."
            : "I authorize El Paso's Best Lawyers to share my name, contact information, legal inquiry, matter location and timing with the firms I selected so they may review my request and contact me."}</span>
        </label>
      ) : <p className="text-xs text-slate-600">{es ? "Sin selección, solo EPBL recibe su solicitud." : "Without a selection, only EPBL receives your request."}</p>}
    </div>
  );

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
      return (es ? 'Escriba su nombre completo.' : 'Enter your full name.');
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return (es ? 'Escriba un correo electrónico válido.' : 'Enter a valid email address.');
    }

    if (
      !phoneOptional &&
      form.phone.trim().length < 7
    ) {
      return es ? 'Escriba un número de teléfono válido.' : 'Enter a valid phone number.';
    }

    if (
      phoneOptional &&
      form.phone.trim().length > 0 &&
      form.phone.trim().length < 7
    ) {
      return es ? 'Escriba un número de teléfono válido o deje el campo vacío.' : 'Enter a valid phone number or leave it blank.';
    }

    if (form.legalIssue.trim().length < 10) {
      return es ? 'Describa brevemente cómo puede ayudarle un abogado.' : 'Please briefly describe how a lawyer may be able to help.';
    }

    return '';
  };

  const sendLeadNotification = async (leadId: string, token: string) => {
      const response = await fetch(
        '/api/send-lead',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            leadId,
            turnstileToken: token,
            fullName:
              form.fullName.trim(),

            email:
              form.email.trim(),

            phone:
              form.phone.trim(),

            legalIssue:
              form.legalIssue.trim(),

            matterLocation:
              form.matterLocation.trim() || null,

            matterTiming:
              form.matterTiming.trim() || null,

            firmId:
              firmId || null,

            firmName:
              firmName || null,

            firmEmail:
              firmEmail || null,

            practiceArea:
              effectivePracticeArea,

            recipientIds: selectedIds,
            sharingConsent,
            consentVersion: "epbl-inquiry-v1",

            ...getLeadAttribution(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.status === 403
          ? (es ? 'Falló la verificación de seguridad. Inténtelo de nuevo.' : 'Security verification failed. Please try again.')
          : response.status === 409
            ? (es ? 'Esta solicitud ya se envió.' : 'This request has already been submitted.')
            : response.status === 422
              ? (es ? 'La disponibilidad cambió. Actualice la página y revise su selección.' : 'Firm availability changed. Refresh the page and review your selection.')
            : (es ? 'No se pudo guardar su solicitud. Inténtelo de nuevo.' : 'Your request could not be saved. Please try again.'));
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

    if (!turnstileToken) {
      setErrorMessage((es ? 'Complete la verificación de seguridad antes de enviar.' : 'Please complete the security verification before submitting.'));
      return;
    }

    if (loadedKey !== recipientKey || (selectedIds.length > 0 && !sharingConsent)) {
      setErrorMessage(es ? "Revise los despachos y confirme su autorización antes de enviar." : "Review the firms and confirm your authorization before submitting.");
      return;
    }

    setLoading(true);

    try {
      const leadId = crypto.randomUUID();
      await sendLeadNotification(leadId, turnstileToken);
      trackMetaLead();

      setTurnstileResetKey((value) => value + 1);

      /*
       * Do not claim that a specific firm has
       * received the inquiry. The platform captures
       * the lead first.
       */
      setSuccessMessage(
        (es ? "Su solicitud se envió correctamente. El Paso's Best Lawyers recibió su solicitud." : "Your consultation request was submitted successfully. El Paso's Best Lawyers has received your request.")
      );

      setForm(EMPTY_FORM);
      selectRecipients([]);

      onSuccess?.();
    } catch (error) {
      setTurnstileResetKey((value) => value + 1);
      console.error(
        'Lead submission failed:',
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : (es ? 'No se pudo enviar su solicitud. Inténtelo de nuevo.' : 'Your request could not be submitted. Please try again.')
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
                  Share only what is necessary
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

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={form.matterLocation}
                  onChange={(event) =>
                    updateField(
                      'matterLocation',
                      event.target.value
                    )
                  }
                  placeholder="Where did this happen? (Optional)"
                  className="border-white/15 bg-white/10 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
                <Input
                  value={form.matterTiming}
                  onChange={(event) =>
                    updateField(
                      'matterTiming',
                      event.target.value
                    )
                  }
                  placeholder="When did this happen? (Optional)"
                  className="border-white/15 bg-white/10 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
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

              {recipientSelection}
              <p className="text-xs leading-5 text-slate-400">
                El Paso&apos;s Best Lawyers receives your request. Your information is only forwarded to firms you authorize. Submission does not establish an attorney-client relationship or guarantee representation. Do not include confidential or highly sensitive information. See our <a href="/privacy" className="font-semibold underline">Privacy Policy</a>.
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
              <LeadTurnstile onToken={setTurnstileToken} resetKey={turnstileResetKey} />
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
          {es ? "Ayuda legal" : "Legal Help"}
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
                {es ? "Nombre completo *" : "Full Name *"}
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
                  placeholder={es ? "Su nombre completo" : "Your full name"}
                  autoComplete="name"
                  className="pl-10 text-slate-900"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead-email">
                {es ? "Correo electrónico *" : "Email Address *"}
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
                {es ? 'Teléfono' : 'Phone Number'}{phoneOptional ? (es ? ' (Opcional)' : ' (Optional)') : ' *'}
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
                  required={!phoneOptional}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-matter-location">
                {es ? "¿Dónde ocurrió?" : "Where did this happen?"}{' '}
                <span className="font-normal text-gray-500">
                  {es ? "(Opcional)" : "(Optional)"}
                </span>
              </Label>

              <Input
                id="lead-matter-location"
                value={form.matterLocation}
                onChange={(event) =>
                  updateField(
                    'matterLocation',
                    event.target.value
                  )
                }
                placeholder={es ? "El Paso, otra ciudad de Texas u otro lugar" : "El Paso, another Texas city, or elsewhere"}
                className="text-slate-900"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-matter-timing">
                {es ? "¿Cuándo ocurrió?" : "When did this happen?"}{' '}
                <span className="font-normal text-gray-500">
                  {es ? "(Opcional)" : "(Optional)"}
                </span>
              </Label>

              <Input
                id="lead-matter-timing"
                value={form.matterTiming}
                onChange={(event) =>
                  updateField(
                    'matterTiming',
                    event.target.value
                  )
                }
                placeholder={es ? "Por ejemplo, la semana pasada" : "e.g. last week, June 2026"}
                className="text-slate-900"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-legal-issue">
              {es ? "¿Cómo puede ayudarle un abogado? *" : "How can a lawyer help? *"}
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
              placeholder={es ? "Describa brevemente su asunto legal, fechas importantes y el tipo de ayuda que necesita." : "Briefly describe your legal issue, important dates, and the type of help you are seeking."}
              rows={6}
              className="text-slate-900"
              disabled={loading}
              required
            />

            <p className="text-xs text-gray-500">
              {es ? "No incluya información confidencial ni muy sensible." : "Do not include confidential or highly sensitive information."}
            </p>
          </div>

          {recipientSelection}
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-[#1FA8A1] text-base font-semibold hover:bg-[#178D87]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {es ? "Enviando solicitud..." : "Submitting Request..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {es ? "Solicitar consulta" : "Request Consultation"}
              </>
            )}
          </Button>

          <p className="text-center text-xs leading-5 text-gray-500">
            {es ? "EPBL recibe su solicitud y solo la comparte con los despachos que autorice. El envío no crea una relación abogado-cliente ni garantiza representación. No incluya información confidencial. Consulte nuestra " : "EPBL receives your request and shares it only with firms you authorize. Submission does not establish an attorney-client relationship or guarantee representation. Do not include confidential or highly sensitive information. See our "}<a href="/privacy" className="font-semibold underline">{es ? "Política de privacidad" : "Privacy Policy"}</a>.
          </p>
          <LeadTurnstile onToken={setTurnstileToken} resetKey={turnstileResetKey} />
        </form>
      </div>
    </section>
  );
}
