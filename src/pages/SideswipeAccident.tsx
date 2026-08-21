import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Scale, Car, AlertTriangle } from "lucide-react";

export default function SideswipeAccident() {
  useEffect(() => {
    document.title =
      "Best Sideswipe Accident Lawyers in El Paso, TX | El Paso's Best Lawyers";

    const description =
      "Find experienced sideswipe accident lawyers in El Paso, Texas. Compare attorneys who handle lane-change crashes, highway sideswipes, disputed fault, injuries, and insurance claims.";

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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            El Paso&apos;s Best Lawyers
          </Link>

          <Link
            to="/el-paso-personal-injury-lawyers"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Personal Injury
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              El Paso Personal Injury Lawyers
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Best Sideswipe Accident Lawyers in El Paso, TX
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Sideswipe crashes can happen in seconds when a driver changes
              lanes, drifts across traffic, fails to check a blind spot, or
              merges unsafely. Find El Paso attorneys who handle sideswipe
              accident claims involving injuries, disputed liability, and
              insurance companies.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#lawyers"
                className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Find Sideswipe Accident Lawyers
              </a>

              <Link
                to="/el-paso-car-accident-lawyers"
                className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-white"
              >
                View Car Accident Lawyers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold">
              Sideswipe Accidents in El Paso
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              A sideswipe collision occurs when the sides of two vehicles make
              contact while traveling beside one another or while one vehicle
              is moving into another lane. These crashes frequently occur on
              multi-lane roads, highways, entrance ramps, and congested streets.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Although some sideswipes cause relatively minor vehicle damage,
              others can force a vehicle into another lane, barrier, median, or
              surrounding traffic. At highway speeds, a sideswipe can lead to a
              much more serious secondary collision.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Determining fault can also become difficult when drivers give
              conflicting accounts of who crossed the lane line. Evidence such
              as photographs, vehicle damage, witness statements, dash-camera
              footage, police reports, and roadway evidence may become
              important in evaluating what happened.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <Car className="h-9 w-9 text-amber-500" />

            <h3 className="mt-5 text-xl font-bold">
              Common Sideswipe Locations
            </h3>

            <ul className="mt-5 space-y-3 text-slate-600">
              {[
                "Interstate 10",
                "Loop 375",
                "US-54",
                "Multi-lane city streets",
                "Highway entrance and exit ramps",
                "Construction zones",
                "Busy intersections",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CAUSES */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            Common Causes of Sideswipe Collisions
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Unsafe lane changes",
              "Failure to check blind spots",
              "Distracted driving",
              "Drifting out of a traffic lane",
              "Improper merging",
              "Speeding or aggressive driving",
              "Driving under the influence",
              "Fatigued driving",
              "Failure to signal before changing lanes",
            ].map((cause) => (
              <div
                key={cause}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <p className="mt-4 font-semibold">{cause}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INJURIES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold">
            Injuries From Sideswipe Accidents
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            The initial side impact or a secondary crash can cause significant
            injuries. The severity often depends on vehicle speed, the point of
            impact, whether another collision follows, and the vehicles
            involved.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Neck and back injuries",
              "Whiplash",
              "Head and brain injuries",
              "Shoulder injuries",
              "Broken bones",
              "Spinal injuries",
              "Cuts and lacerations",
              "Soft-tissue injuries",
            ].map((injury) => (
              <div
                key={injury}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-amber-500" />
                <span>{injury}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAULT */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Scale className="h-10 w-10 text-amber-400" />

              <h2 className="mt-5 text-3xl font-bold">
                Who Is at Fault in a Sideswipe Accident?
              </h2>

              <p className="mt-5 leading-8 text-slate-300">
                Fault depends on the circumstances of the collision. A driver
                who moves from one lane into another without ensuring the lane
                is clear may be responsible, but sideswipe claims are often
                disputed because both drivers may claim they stayed within
                their lane.
              </p>

              <p className="mt-5 leading-8 text-slate-300">
                An attorney may examine physical vehicle damage, photographs,
                video, witness accounts, police documentation, and other
                available evidence when evaluating liability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8">
              <h3 className="text-xl font-bold">
                Evidence That May Matter
              </h3>

              <ul className="mt-6 space-y-4 text-slate-300">
                {[
                  "Police crash reports",
                  "Photos of vehicle damage",
                  "Dash-camera or surveillance video",
                  "Witness statements",
                  "Roadway and lane markings",
                  "Medical records",
                  "Insurance documentation",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LAWYERS */}
      <section id="lawyers" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Find an El Paso Sideswipe Accident Lawyer
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Compare El Paso personal injury attorneys who represent people
            injured in sideswipe and lane-change collisions.
          </p>

          <Link
            to="/el-paso-personal-injury-lawyers"
            className="mt-8 inline-block rounded-lg bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Browse Personal Injury Lawyers
          </Link>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-2xl font-bold">Related Accident Pages</h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/el-paso-car-accident-lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-slate-500"
            >
              Car Accidents
            </Link>

            <Link
              to="/el-paso-highway-accident-lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-slate-500"
            >
              Highway Accidents
            </Link>

            <Link
              to="/el-paso-multi-vehicle-accident-lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-slate-500"
            >
              Multi-Vehicle Accidents
            </Link>

            <Link
              to="/el-paso-rear-end-accident-lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-slate-500"
            >
              Rear-End Accidents
            </Link>

            <Link
              to="/el-paso-rollover-accident-lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:border-slate-500"
            >
              Rollover Accidents
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}