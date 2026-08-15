import { useEffect } from "react";
import { Link } from "react-router-dom";

const cases = [
  "Retaliation", "Discrimination-Related Firing", "Protected Leave",
  "Wage & Overtime Complaints", "Whistleblower Retaliation", "Employment Contracts",
  "Severance Disputes", "Workplace Complaints", "FMLA-Related Termination",
  "Harassment Complaints", "Protected Activity", "Other Unlawful Termination Claims",
];

const faqs = [
  ["What may qualify as wrongful termination in Texas?", "Texas generally follows at-will employment, but a termination may still raise legal issues when it violates applicable law, such as certain retaliation, discrimination, protected-leave, or other legally protected activity provisions."],
  ["Can I have a wrongful termination claim if I was an at-will employee?", "Potentially. At-will employment does not necessarily permit an employer to terminate someone for an unlawful reason. The facts, timing, documentation, and applicable federal or Texas law can matter."],
  ["What evidence can matter in a wrongful termination case?", "Emails, text messages, performance records, complaints, disciplinary records, employment policies, witness information, termination documents, and the timing of events may be relevant depending on the claim."],
  ["How do I compare wrongful termination lawyers in El Paso?", "Consider experience with employment law, retaliation and discrimination claims, wage or leave disputes, employment agreements, administrative proceedings, and workplace litigation."],
];

export default function WrongfulTermination() {
  useEffect(() => {
    document.title = "Best Wrongful Termination Lawyers in El Paso, TX | El Paso's Best Lawyers";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Compare wrongful termination lawyers in El Paso, TX for retaliation, discrimination, protected leave, wage complaints, employment contracts, severance disputes, and unlawful firing claims.";
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Wrongful Termination Lawyer Directory
        </p>
        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Wrongful Termination Lawyers in El Paso, TX
        </h1>
        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso wrongful termination lawyers and employment attorneys handling retaliation,
          discrimination-related firing, protected leave, wage complaints, employment contracts,
          severance disputes, and other unlawful termination claims.
        </p>
        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          If you believe you were unlawfully fired in El Paso, this directory can help you
          understand common employment issues and compare participating local attorneys.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Common El Paso Wrongful Termination Matters</h2>
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
            <h2 className="text-2xl font-medium">How to Compare Wrongful Termination Attorneys</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Experience with wrongful termination and employment claims</li>
              <li>• Handling retaliation and discrimination-related termination</li>
              <li>• Experience with wage, leave, and workplace-rights disputes</li>
              <li>• Ability to evaluate emails, personnel records, and witness evidence</li>
              <li>• Clear explanation of fees and communication practices</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">What a Wrongful Termination Lawyer Can Help With</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Evaluating the stated reason for termination</li>
              <li>• Reviewing retaliation, discrimination, or protected-activity issues</li>
              <li>• Reviewing employment policies, contracts, and severance terms</li>
              <li>• Preserving workplace communications and employment records</li>
              <li>• Evaluating settlement and litigation options</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Wrongful Termination in El Paso</h2>
          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              Texas is generally an at-will employment state, but employers may still be restricted
              from terminating workers for certain unlawful reasons. Depending on the facts,
              a firing may involve retaliation, discrimination, protected leave, wage complaints,
              contractual rights, or other legally protected workplace activity.
            </p>
            <p>
              Wrongful termination disputes are often fact-specific. The timing of a termination,
              the employer's stated reason, prior performance history, workplace complaints,
              emails, text messages, policies, contracts, and witness information may all
              affect how an employment attorney evaluates a potential claim.
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
          <h2 className="text-3xl font-medium">Related El Paso Employment Lawyer Directories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/el-paso-workplace-discrimination-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Workplace Discrimination Lawyers</Link>
            <Link to="/el-paso-wage-hour-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Wage & Hour Lawyers</Link>
            <Link to="/el-paso-business-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Business Lawyers</Link>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso's Best Lawyers is a lawyer directory and informational resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}

