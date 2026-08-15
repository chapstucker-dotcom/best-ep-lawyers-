import { useEffect } from "react";
import { Link } from "react-router-dom";

const issues = [
  "Termination or Layoffs",
  "Failure to Hire",
  "Failure to Promote",
  "Demotion",
  "Pay or Benefits",
  "Work Assignments",
  "Harassment",
  "Retaliation",
  "Performance Reviews",
  "Discipline",
  "Severance Agreements",
  "Workplace Policies",
];

const faqs = [
  [
    "What is age discrimination in the workplace?",
    "Age discrimination generally refers to unfavorable workplace treatment because of age. Whether particular conduct creates a legal claim depends on the facts, the employer, the worker, and the law that applies."
  ],
  [
    "Can an El Paso lawyer review an age-related termination?",
    "An employment lawyer can review the circumstances surrounding a termination, including the stated reason, timing, performance history, workplace communications, comparison evidence, and other facts that may be relevant."
  ],
  [
    "What evidence should I preserve?",
    "Keep relevant emails, text messages, performance reviews, disciplinary records, job postings, policies, pay records, severance documents, termination paperwork, and notes identifying important dates, statements, and witnesses."
  ],
  [
    "Can age discrimination overlap with retaliation or wrongful termination?",
    "Potentially. Workplace disputes can involve more than one issue, so an attorney may evaluate age discrimination together with retaliation, wrongful termination, severance, wage, contract, or other employment-law concerns when the facts support them."
  ],
];

export default function AgeDiscrimination() {
  useEffect(() => {
    document.title =
      "Best Age Discrimination Lawyers in El Paso, TX | Compare Attorneys";

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content =
      "Compare age discrimination lawyers in El Paso, TX for workplace termination, hiring, promotion, demotion, harassment, retaliation, severance, and other age-related employment disputes.";
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Employment Law Directory
        </p>

        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Age Discrimination Lawyers in El Paso, TX
        </h1>

        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso age discrimination lawyers and employment attorneys
          handling workplace disputes involving termination, hiring, promotion,
          demotion, harassment, retaliation, compensation, severance, and other
          alleged age-related employment actions.
        </p>

        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          Age-related workplace disputes can turn on timing, documents,
          performance history, employer explanations, workplace statements,
          comparison evidence, and applicable federal or Texas law. This
          directory helps users compare participating El Paso attorneys with
          relevant employment-law experience.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Age Discrimination Issues an Employment Lawyer May Review
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {issues.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-5 py-5 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">
              What to Preserve for an Attorney Review
            </h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Termination, discipline, or demotion documents</li>
              <li>• Performance reviews and employment records</li>
              <li>• Emails, texts, and relevant workplace communications</li>
              <li>• Job postings, promotion records, and organizational changes</li>
              <li>• Severance agreements, contracts, policies, and pay records</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">
              How to Compare Age Discrimination Attorneys
            </h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Experience with employment discrimination matters</li>
              <li>• Familiarity with age-related termination disputes</li>
              <li>• Experience evaluating retaliation and related claims</li>
              <li>• Familiarity with administrative and court proceedings</li>
              <li>• Clear communication about fees, deadlines, and strategy</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Age Discrimination and Employment Decisions in El Paso
          </h2>

          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              Workplace age disputes may arise from hiring decisions,
              promotions, layoffs, discipline, compensation, job assignments,
              performance evaluations, or termination. An attorney reviewing a
              matter may consider both the employer's stated reason and the
              surrounding evidence.
            </p>

            <p>
              Because employment disputes can involve multiple legal theories,
              an age discrimination concern may also require review of alleged
              retaliation, wrongful termination, workplace discrimination,
              contracts, severance terms, or other employment issues.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>

          <div className="mt-6 space-y-4">
            {faqs.map(([question, answer]) => (
              <article
                key={question}
                className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-6"
              >
                <h3 className="text-xl font-semibold text-amber-400">
                  {question}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">
            Explore Related El Paso Employment Law Directories
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/el-paso-employment-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Employment Lawyers
            </Link>

            <Link
              to="/el-paso-workplace-discrimination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Workplace Discrimination Lawyers
            </Link>

            <Link
              to="/el-paso-wrongful-termination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Wrongful Termination Lawyers
            </Link>

            <Link
              to="/el-paso-retaliation-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Retaliation Lawyers
            </Link>

            <Link
              to="/el-paso-sexual-harassment-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Sexual Harassment Lawyers
            </Link>

            <Link
              to="/el-paso-severance-agreement-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Severance Agreement Lawyers
            </Link>
          </div>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso&apos;s Best Lawyers is a lawyer directory and informational
          resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}
