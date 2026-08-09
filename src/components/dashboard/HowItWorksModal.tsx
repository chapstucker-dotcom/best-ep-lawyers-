import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  UserRoundSearch,
  X,
} from "lucide-react";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
  onListFirm?: () => void;
}

const steps = [
  {
    title: "People search for legal help",
    copy: "Visitors search by practice area, firm name, or legal need and see El Paso-focused results.",
    icon: Search,
  },
  {
    title: "They compare local law firms",
    copy: "Professional firm profiles make it easy to review practice areas, attorneys, credentials, and contact details.",
    icon: UserRoundSearch,
  },
  {
    title: "Your firm builds trust",
    copy: "Showcase your team, experience, office information, website, and firm introduction video before the first call.",
    icon: ShieldCheck,
  },
  {
    title: "Prospective clients connect",
    copy: "Visitors can call, visit your website, request a consultation, or get directions directly from your profile.",
    icon: Building2,
  },
  {
    title: "You track visibility and growth",
    copy: "Paid plans unlock analytics, enhanced profiles, premium placement, and additional attorney profiles.",
    icon: BarChart3,
  },
];

export default function HowItWorksModal({ open, onClose, onListFirm }: HowItWorksModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const ActiveIcon = steps[activeStep].icon;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#071f46] text-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Close how it works"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-[600px] lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative flex flex-col justify-between overflow-hidden p-7 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(231,179,31,.22),transparent_35%),linear-gradient(140deg,#0a2b5b_0%,#061a3b_70%)]" />
            <div className="relative z-10">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#e7b31f]">
                El Paso's Best Lawyers
              </p>
              <h2 id="how-it-works-title" className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">
                How the directory connects law firms with local clients
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                A quick walkthrough for El Paso law firms considering a Complimentary Founding Listing.
              </p>
            </div>

            <div className="relative z-10 my-8 rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-[#e7b31f] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#071f46]">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <ActiveIcon className="h-9 w-9 text-[#e7b31f]" />
              </div>
              <h3 className="text-2xl font-bold sm:text-3xl">{steps[activeStep].title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-200 sm:text-lg">{steps[activeStep].copy}</p>

              <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  key={activeStep}
                  className="h-full origin-left animate-[howItWorksProgress_4.2s_linear_forwards] rounded-full bg-[#e7b31f]"
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeStep === index ? "w-12 bg-[#e7b31f]" : "w-5 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`View step ${index + 1}: ${step.title}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white p-7 text-[#071f46] sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b38300]">For El Paso law firms</p>
            <h3 className="mt-3 text-3xl font-extrabold">Your founding listing can include</h3>

            <div className="mt-7 space-y-4">
              {[
                "Professional firm profile",
                "Attorney profiles and biographies",
                "Practice area visibility",
                "Direct phone and website links",
                "Firm introduction video",
                "Consultation requests",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c69200]" />
                  <span className="font-semibold">{feature}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onListFirm?.();
              }}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e7b31f] px-6 py-4 text-base font-black text-[#071f46] transition hover:brightness-105"
            >
              Claim Your Complimentary Listing
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-3 text-center text-sm text-slate-500">No cost. No obligation. Built exclusively for El Paso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
