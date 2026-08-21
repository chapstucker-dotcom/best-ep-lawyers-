import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle2,
  Scale,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const MergingAccident = () => {
  const pageTitle = "Best Merging Accident Lawyers in El Paso, TX";

  document.title = `${pageTitle} | El Paso's Best Lawyers`;

  const issues = [
    "Unsafe highway merging",
    "Failure to yield while merging",
    "On-ramp and entrance-ramp collisions",
    "Drivers forcing their way into traffic",
    "Failure to check blind spots",
    "Sudden or improper merging",
    "Commercial truck merging accidents",
    "Disputed fault and insurance claims",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-80"
          >
            El Paso&apos;s Best Lawyers
          </Link>

          <Link
            to="/el-paso-personal-injury-lawyers"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Personal Injury
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                El Paso, Texas
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Best Merging Accident Lawyers in El Paso, TX
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                Compare El Paso attorneys who handle merging accident claims
                involving unsafe merges, failure to yield, highway entrance
                ramps, blind spots, and disputed liability.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#lawyers"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground"
                >
                  Find Merging Accident Lawyers
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  to="/el-paso-car-accident-lawyers"
                  className="inline-flex items-center gap-2 rounded-md border bg-background px-6 py-3 font-semibold"
                >
                  View Car Accident Lawyers
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold">
              Merging Accident Claims in El Paso
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Merging accidents often occur when vehicles enter highways,
              change traffic lanes, or move from entrance ramps into faster
              traffic. Drivers must pay attention to surrounding vehicles and
              merge only when it is reasonably safe to do so.
            </p>

            <p className="mt-5 leading-8 text-muted-foreground">
              When a collision occurs during a merge, determining fault may
              depend on the position and speed of each vehicle, right-of-way
              issues, turn signals, roadway markings, witness accounts, and
              other available evidence.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Common Merging Accident Issues
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {issues.map((issue) => (
                <div
                  key={issue}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-3xl font-bold">
              Who May Be Responsible for a Merging Crash?
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Responsibility depends on how the crash happened. A merging
              driver may be responsible for entering traffic when it was
              unsafe, while another driver&apos;s speed, distraction, or other
              conduct may also be relevant. Some crashes involve disputed or
              shared responsibility.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Evidence in a Merging Accident Case
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Useful evidence may include photographs, vehicle damage, police
              reports, dash-camera recordings, traffic-camera footage, witness
              statements, roadway markings, medical records, and insurance
              communications. Evidence can be particularly important when the
              drivers disagree about who had the right of way.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Merging Accidents on El Paso Roads
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              El Paso drivers regularly merge into highway traffic and navigate
              busy entrance and exit areas. Accidents can occur when traffic
              speeds differ, visibility is limited, or a driver attempts to
              enter an occupied lane without enough space.
            </p>
          </div>

          <aside>
            <div className="sticky top-6 rounded-xl border bg-card p-6 shadow-sm">
              <Car className="h-9 w-9" />

              <h2 className="mt-4 text-2xl font-bold">
                Looking for an El Paso Lawyer?
              </h2>

              <p className="mt-3 leading-7 text-muted-foreground">
                Browse lawyers serving El Paso and compare attorneys by
                practice area.
              </p>

              <a
                href="#lawyers"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                View Lawyers
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="mt-6 space-y-4 border-t pt-6">
                <div className="flex gap-3">
                  <Scale className="mt-1 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Compare Attorneys</p>
                    <p className="text-sm text-muted-foreground">
                      Review lawyers by relevant practice area.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">El Paso Focused</p>
                    <p className="text-sm text-muted-foreground">
                      Built to help people find legal services in the El Paso
                      area.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section id="lawyers" className="border-t bg-muted/20">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-3xl font-bold">
              El Paso Merging Accident Lawyers
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
              Attorney listings for this practice area can appear here as the
              El Paso&apos;s Best Lawyers directory expands.
            </p>

            <Link
              to="/el-paso-personal-injury-lawyers"
              className="mt-7 inline-flex items-center gap-2 font-semibold hover:underline"
            >
              Browse Personal Injury Lawyers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MergingAccident;