import { useEffect } from "react";
import { Link } from "react-router-dom";

const cases = [
  "Dooring Accidents", "Intersection Collisions", "Distracted Driving",
  "Failure to Yield", "Unsafe Passing", "Hit-and-Run Accidents",
  "Commercial Vehicle Collisions", "Road Hazard Accidents",
  "Serious Head Injuries", "Spinal Cord Injuries", "Broken Bones",
  "Wrongful Death Claims",
];

const faqs = [
  ["What should I do after a bicycle accident in El Paso?", "Get medical attention, preserve photographs and witness information, and keep records related to treatment, lost work, and damaged property. An attorney can evaluate the facts and explain possible claims."],
  ["Can a bicyclist recover compensation after being hit by a car in Texas?", "Depending on the facts, an injured bicyclist may have claims involving medical expenses, lost income, pain and other damages. Fault, insurance coverage, available evidence, and Texas law can affect a claim."],
  ["What if the driver says the bicycle rider caused the crash?", "Disputed fault does not necessarily end a claim. Crash reports, photographs, video, witness accounts, vehicle damage, roadway conditions, and other records may help determine responsibility."],
  ["How do I compare El Paso bicycle accident lawyers?", "Consider experience with bicycle and personal injury cases, disputed-liability claims, communication practices, fee arrangements, and serious injury matters."],
];

export default function BicycleAccident() {
  useEffect(() => {
    document.title = "Best Bicycle Accident Lawyers in El Paso, TX | El Paso's Best Lawyers";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Compare El Paso bicycle accident lawyers and attorneys handling cyclist injuries, vehicle collisions, hit-and-runs, serious injuries, and wrongful death claims.";
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Bicycle Accident Lawyer Directory
        </p>
        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Bicycle Accident Lawyers in El Paso, TX
        </h1>
        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso bicycle accident lawyers and attorneys handling cyclist injuries,
          vehicle collisions, hit-and-run crashes, disputed fault, serious injuries, and wrongful death claims.
        </p>
        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          If you were injured while riding a bicycle in El Paso, this directory can help you
          understand common bicycle accident issues and compare participating local attorneys.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Common El Paso Bicycle Accident Cases</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cases.map((item) => (
              <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-5 py-5 font-semibold">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">How to Compare Bicycle Accident Attorneys</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Experience with bicycle and motor-vehicle injury claims</li>
              <li>• Handling disputed fault and insurance issues</li>
              <li>• Experience with serious and catastrophic injuries</li>
              <li>• Ability to preserve video, witness, and crash evidence</li>
              <li>• Clear explanation of fees and communication practices</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">What a Bicycle Accident Lawyer Can Help With</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Investigating how the collision happened</li>
              <li>• Identifying potentially responsible parties</li>
              <li>• Reviewing insurance coverage and liability disputes</li>
              <li>• Documenting injuries, expenses, and lost income</li>
              <li>• Evaluating settlement and litigation options</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Bicycle Accidents in El Paso</h2>
          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              Bicycle riders share El Paso streets with cars, pickups, commercial vehicles,
              and other traffic. Collisions can occur when a driver turns across a cyclist's
              path, opens a vehicle door, fails to yield, passes unsafely, or does not notice
              a rider at an intersection.
            </p>
            <p>
              Because cyclists have little physical protection, crashes can cause significant
              injuries. Claims may involve medical treatment, rehabilitation, lost work,
              damaged property, insurance disputes, and questions about responsibility.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(([q, a]) => (
              <article key={q} className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-6">
                <h3 className="text-xl font-semibold text-amber-400">{q}</h3>
                <p className="mt-3 leading-7 text-slate-300">{a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">Related El Paso Injury Lawyer Directories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/el-paso-personal-injury-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Personal Injury Lawyers</Link>
            <Link to="/el-paso-car-accident-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Car Accident Lawyers</Link>
            <Link to="/el-paso-truck-accident-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Truck Accident Lawyers</Link>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso's Best Lawyers is a lawyer directory and informational resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}
