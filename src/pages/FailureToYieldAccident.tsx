import { useEffect } from "react";
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

const FailureToYieldAccident = () => {
  const pageTitle = "Best Failure to Yield Accident Lawyers in El Paso, TX";
  const description =
    "Find El Paso failure to yield accident lawyers for crashes involving intersections, left turns, merging traffic, stop signs, pedestrians, disputed fault, and insurance claims.";

  useEffect(() => {
    document.title = `${pageTitle} | El Paso's Best Lawyers`;

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description;

    window.scrollTo(0, 0);
  }, []);

  const issues = [
    "Failure to yield at intersections",
    "Failure to yield while turning left",
    "Failure to yield when merging",
    "Failure to yield from private driveways",
    "Failure to yield to pedestrians",
    "Failure to yield at stop or yield signs",
    "Failure to yield to oncoming traffic",
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
                Best Failure to Yield Accident Lawyers in El Paso, TX
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                Compare El Paso attorneys who handle failure to yield accident
                claims involving intersections, left turns, merging traffic,
                stop signs, pedestrians, and disputed right-of-way issues.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#lawyers"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground"
                >
                  Find Failure to Yield Accident Lawyers
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
              Failure to Yield Accident Claims in El Paso
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Failure to yield accidents can happen when a driver enters an
              intersection, turns across traffic, merges into another lane, or
              enters a roadway without yielding to vehicles or pedestrians
              that have the right of way.
            </p>

            <p className="mt-5 leading-8 text-muted-foreground">
              Determining responsibility may require examining traffic signals,
              signs, roadway markings, vehicle positions, witness statements,
              photographs, video footage, and other evidence showing how the
              collision occurred.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Common Failure to Yield Accident Issues
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
              Who May Be Responsible for a Failure to Yield Crash?
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Responsibility depends on the circumstances of the collision.
              Drivers generally must follow traffic controls and yield when
              required, but the conduct of multiple drivers may be relevant.
              Some accidents involve disputed or shared responsibility.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Evidence in a Failure to Yield Accident Case
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Evidence may include police reports, photographs, vehicle damage,
              dash-camera recordings, traffic-camera footage, witness
              statements, roadway signs and markings, medical records, and
              insurance communications. This evidence can help establish which
              vehicle had the right of way and how the crash occurred.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Failure to Yield Accidents on El Paso Roads
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              El Paso drivers encounter busy intersections, highway entrances,
              frontage roads, turn lanes, and pedestrian crossings throughout
              the city. Failure to yield in these areas can result in serious
              collisions, particularly when vehicles are traveling at higher
              speeds.
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
              El Paso Failure to Yield Accident Lawyers
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

export default FailureToYieldAccident;