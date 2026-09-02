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

const RedLightAccident = () => {
  const pageTitle = "Best Red Light Accident Lawyers in El Paso, TX";
  const description =
    "Find El Paso red light accident lawyers for intersection crashes involving T-bone collisions, left turns, distracted driving, disputed traffic signals, fault, and insurance claims.";

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
    "Running a red light",
    "Entering an intersection after the signal changes",
    "Failure to stop before turning",
    "Red-light T-bone collisions",
    "Left-turn crashes at traffic signals",
    "Distracted driving at intersections",
    "Drunk driving at traffic signals",
    "Disputed signal timing and fault",
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
                Best Red Light Accident Lawyers in El Paso, TX
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                Compare El Paso attorneys who handle red-light accident claims
                involving intersection crashes, T-bone collisions, left turns,
                distracted driving, and disputed traffic-signal issues.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#lawyers"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground"
                >
                  Find Red Light Accident Lawyers
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
              Red Light Accident Claims in El Paso
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Red-light accidents often occur when a driver enters an
              intersection against a traffic signal, attempts to beat a
              changing light, or fails to stop before crossing another
              vehicle&apos;s path.
            </p>

            <p className="mt-5 leading-8 text-muted-foreground">
              These crashes can result in serious side-impact, head-on, and
              multi-vehicle collisions. Determining fault may require reviewing
              traffic signals, witness statements, police reports, vehicle
              damage, photographs, and available video footage.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Common Red Light Accident Issues
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
              Who May Be Responsible for a Red Light Crash?
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Responsibility depends on the facts of the collision. A driver
              who enters an intersection against a red signal may be at fault,
              but the actions of other drivers can also be relevant. Some cases
              involve disputed accounts of which driver had the green light.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Evidence in a Red Light Accident Case
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Useful evidence may include police reports, intersection or
              surveillance video, dash-camera footage, photographs, witness
              statements, vehicle damage, roadway markings, medical records,
              and insurance communications.
            </p>

            <h2 className="mt-12 text-3xl font-bold">
              Red Light Accidents at El Paso Intersections
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              El Paso has many high-traffic intersections where drivers make
              left turns, cross multiple lanes, and enter major roadways.
              Crashes can become especially serious when a driver runs a red
              light at speed and strikes the side of another vehicle.
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
              El Paso Red Light Accident Lawyers
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

export default RedLightAccident;