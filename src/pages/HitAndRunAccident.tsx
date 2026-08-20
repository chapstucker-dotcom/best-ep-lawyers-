import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function HitAndRunAccident() {
  useEffect(() => {
    document.title =
      "El Paso Hit-and-Run Accident Lawyers | El Paso's Best Lawyers";

    const description =
      "Find El Paso hit-and-run accident lawyers. Learn about hit-and-run claims, uninsured motorist coverage, evidence, deadlines, and how attorneys may help after a driver leaves the scene.";

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description;
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-400">
            El Paso&apos;s Best Lawyers
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            El Paso Hit-and-Run Accident Lawyers
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A hit-and-run crash can leave an injured person facing medical
            bills, vehicle damage, lost income, and uncertainty about who will
            pay. An El Paso hit-and-run accident lawyer can evaluate available
            insurance coverage, investigate the collision, preserve evidence,
            and help pursue compensation when another driver leaves the scene.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/"
              className="rounded-md bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Find a Lawyer
            </Link>

            <Link
              to="/el-paso-car-accident-lawyers"
              className="rounded-md border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Car Accident Lawyers
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <article className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-3xl font-bold">
                What Is a Hit-and-Run Accident?
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                A hit-and-run accident occurs when a driver involved in a
                collision leaves the scene without providing required
                information or otherwise complying with applicable duties
                after a crash. These cases can involve cars, trucks,
                motorcycles, bicycles, and pedestrians.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                What to Do After a Hit-and-Run Crash
              </h2>

              <div className="mt-5 space-y-4 text-slate-700">
                <p>
                  Your immediate priority should be safety and medical care.
                  When possible, report the collision to law enforcement and
                  document everything you can about the fleeing vehicle.
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Call 911 when emergency assistance is needed.</li>
                  <li>Seek medical attention for injuries.</li>
                  <li>Report the crash to law enforcement.</li>
                  <li>
                    Write down the vehicle&apos;s make, model, color, license
                    plate information, and direction of travel.
                  </li>
                  <li>Photograph the scene and vehicle damage.</li>
                  <li>Obtain contact information from witnesses.</li>
                  <li>
                    Notify your automobile insurance company promptly.
                  </li>
                  <li>
                    Preserve dash-camera footage, photographs, videos, and
                    other evidence.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                How Hit-and-Run Accident Claims Are Investigated
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                Identifying the fleeing driver may require evidence beyond the
                police report. Depending on the circumstances, an
                investigation may involve witnesses, surveillance cameras,
                nearby businesses, traffic-camera evidence, vehicle debris,
                photographs, repair records, and other available information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Uninsured Motorist Coverage and Hit-and-Run Accidents
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                When the at-fault driver cannot be identified or does not have
                insurance, uninsured motorist coverage may become important.
                Whether coverage applies depends on the insurance policy and
                the circumstances of the collision.
              </p>

              <p className="mt-4 leading-7 text-slate-700">
                An attorney can review the policy, evaluate available
                insurance coverage, and address disputes that may arise during
                the claims process.
              </p>

              <Link
                to="/el-paso-uninsured-motorist-lawyers"
                className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
              >
                Learn more about uninsured motorist claims →
              </Link>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Compensation After a Hit-and-Run Accident
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                The damages available in a particular case depend on the facts,
                injuries, insurance coverage, and applicable law. Potential
                damages may include:
              </p>

              <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-700">
                <li>Medical expenses</li>
                <li>Future medical treatment</li>
                <li>Lost wages</li>
                <li>Loss of earning capacity</li>
                <li>Property damage</li>
                <li>Pain and suffering</li>
                <li>Physical impairment</li>
                <li>Other legally recoverable losses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Why Speak With an El Paso Hit-and-Run Lawyer?
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                Hit-and-run cases can present additional challenges because
                the responsible driver may initially be unknown. A lawyer can
                help investigate the crash, communicate with insurers,
                evaluate available coverage, document damages, and protect
                important legal deadlines.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Hit-and-Run Accidents in El Paso
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                Hit-and-run collisions can happen on neighborhood streets,
                major intersections, highways, and heavily traveled roads
                throughout the El Paso area. Evidence can disappear quickly,
                particularly surveillance footage and witness information, so
                preserving available evidence can be important.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Find a Hit-and-Run Accident Lawyer in El Paso
              </h2>

              <p className="mt-4 leading-7 text-slate-700">
                El Paso&apos;s Best Lawyers helps consumers explore attorneys
                and law firms serving the El Paso area. Review lawyers by
                practice area and find legal counsel appropriate for your
                situation.
              </p>

              <Link
                to="/"
                className="mt-6 inline-block rounded-md bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Find an El Paso Lawyer
              </Link>
            </section>
          </article>

          <aside>
            <div className="sticky top-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold">
                Related Accident Lawyers
              </h2>

              <nav className="mt-5 flex flex-col gap-3">
                <Link
                  to="/el-paso-car-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Car Accident Lawyers
                </Link>

                <Link
                  to="/el-paso-uninsured-motorist-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Uninsured Motorist Lawyers
                </Link>

                <Link
                  to="/el-paso-drunk-driving-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Drunk Driving Accident Lawyers
                </Link>

                <Link
                  to="/el-paso-distracted-driving-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Distracted Driving Accident Lawyers
                </Link>

                <Link
                  to="/el-paso-rear-end-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Rear-End Accident Lawyers
                </Link>

                <Link
                  to="/el-paso-intersection-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Intersection Accident Lawyers
                </Link>

                <Link
                  to="/el-paso-pedestrian-accident-lawyers"
                  className="text-blue-700 hover:underline"
                >
                  Pedestrian Accident Lawyers
                </Link>
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}