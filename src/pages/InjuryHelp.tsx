import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Car, CheckCircle2, Clock3, Scale, ShieldCheck } from "lucide-react";
import LeadCaptureForm from "../components/LeadCaptureForm";

export default function InjuryHelp() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Get Help Finding an El Paso Injury Lawyer | El Paso's Best Lawyers";

    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const existingRobotsContent = robots?.content ?? null;
    const createdRobots = !robots;

    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    robots.content = "noindex, follow";

    return () => {
      document.title = previousTitle;
      if (createdRobots) {
        robots?.remove();
      } else if (robots && existingRobotsContent !== null) {
        robots.content = existingRobotsContent;
      }
    };
  }, []);

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#F7C84A] to-[#E2A822] text-[#071D2F] shadow-sm">
              <Scale className="h-6 w-6" strokeWidth={2.2} />
            </span>
            <span className="font-bold text-[#071D2F] sm:text-lg">
              El Paso&apos;s Best Lawyers
            </span>
          </Link>

          <Link
            to="/el-paso-personal-injury-lawyers"
            className="hidden text-sm font-semibold text-[#176B78] hover:underline sm:inline"
          >
            Compare Injury Lawyers
          </Link>
        </div>
      </header>

      <section className="bg-[#071D2F] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:py-16">
          <div className="pt-2">
            <p className="font-bold uppercase tracking-[0.18em] text-[#F5B800]">
              El Paso Personal Injury Help
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Injured and looking for an attorney in El Paso?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Tell us what happened. El Paso&apos;s Best Lawyers can use the
              information you provide to help identify appropriate participating
              attorneys or firms for your type of injury matter.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B800]" />
                <p className="text-slate-200">Share the basics about your accident or injury.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B800]" />
                <p className="text-slate-200">
                  Your inquiry is reviewed for the type of legal help you are seeking.
                </p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B800]" />
                <p className="text-slate-200">
                  Submitting is free and does not create an attorney-client relationship.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#F5B800] px-6 py-3 font-black text-[#071D2F] transition hover:bg-[#E3B53A] lg:hidden"
            >
              Tell Us What Happened
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div id="lead-form">
            <LeadCaptureForm
              practiceArea="Personal Injury"
              phoneOptional
              title="Tell Us About Your Injury"
              description="Share a few details about what happened and the legal help you are looking for. Do not include confidential or highly sensitive information."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.16em] text-[#176B78]">Injury Matters</p>
          <h2 className="mt-3 text-3xl font-black text-[#071D2F]">
            What type of accident or injury happened?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Personal injury matters can involve many different circumstances.
            Give us enough information to understand the general type of issue.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Car className="h-7 w-7 text-[#176B78]" />
            <h3 className="mt-4 text-lg font-bold text-[#071D2F]">Vehicle Accidents</h3>
            <p className="mt-2 leading-7 text-slate-600">
              Car, truck, motorcycle, pedestrian, rideshare, and other roadway accidents.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShieldCheck className="h-7 w-7 text-[#176B78]" />
            <h3 className="mt-4 text-lg font-bold text-[#071D2F]">Other Injuries</h3>
            <p className="mt-2 leading-7 text-slate-600">
              Falls, unsafe property conditions, dog bites, serious injuries,
              and other potential injury claims.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Clock3 className="h-7 w-7 text-[#176B78]" />
            <h3 className="mt-4 text-lg font-bold text-[#071D2F]">Recent or Ongoing Issues</h3>
            <p className="mt-2 leading-7 text-slate-600">
              Tell us when and where the incident happened so the inquiry can
              be reviewed with the right context.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <h2 className="text-2xl font-black text-[#071D2F]">
            Prefer to compare attorneys yourself?
          </h2>
          <p className="mt-3 leading-7 text-slate-600">
            Browse El Paso personal injury lawyers and law firms listed in our directory.
          </p>
          <Link
            to="/el-paso-personal-injury-lawyers"
            className="mt-6 inline-flex items-center gap-2 font-bold text-[#176B78] hover:underline"
          >
            Compare Personal Injury Lawyers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-[#071D2F] text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 font-bold text-white">
              <Scale className="h-5 w-5 text-[#F5B800]" />
              El Paso&apos;s Best Lawyers
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link to="/" className="hover:text-white">Home</Link>
              <Link to="/el-paso-personal-injury-lawyers" className="hover:text-white">
                Personal Injury Lawyers
              </Link>
            </div>
          </div>

          <p className="mt-6 border-t border-white/10 pt-6 text-xs leading-6 text-slate-400">
            El Paso&apos;s Best Lawyers is an attorney directory and is not a law
            firm. Information provided through this website is not legal advice.
            Submitting an inquiry does not create an attorney-client relationship,
            does not guarantee representation, and does not guarantee any particular result.
          </p>
        </div>
      </footer>
    </main>
  );
}
