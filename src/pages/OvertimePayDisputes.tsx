import { useEffect } from "react";
import { Link } from "react-router-dom";

const issues = [
  "Unpaid Overtime",
  "Off-the-Clock Work",
  "Meal and Rest Break Pay Issues",
  "Misclassification",
  "Minimum Wage Disputes",
  "Final Paycheck Disputes",
  "Unpaid Bonuses or Commissions",
  "Timekeeping Problems",
  "Payroll Deductions",
  "Retaliation for Wage Complaints",
  "Tip and Service Charge Issues",
  "Other Pay Disputes",
];

const faqs = [
  [
    "What kinds of overtime and pay disputes can an employment lawyer review?",
    "Employment lawyers may review disputes involving unpaid overtime, off-the-clock work, minimum wage, worker classification, final pay, commissions, bonuses, timekeeping practices, payroll deductions, and retaliation connected to wage complaints."
  ],
  [
    "What records should I save for an overtime or pay dispute?",
    "Keep pay stubs, time sheets, schedules, clock-in records, payroll records, employment agreements, commission plans, text messages, emails, policies, and notes showing the hours worked and the pay you received."
  ],
  [
    "Can a pay dispute involve worker misclassification?",
    "Potentially. Whether a worker is properly classified can affect overtime and wage rights. The analysis depends on the actual working relationship and the law that applies, not only the label used by the company."
  ],
  [
    "Can an employer retaliate after a worker raises a wage complaint?",
    "Retaliation issues may arise when an employee reports wage or overtime concerns or exercises certain protected rights. An employment lawyer can review the timing, communications, discipline, and other facts surrounding the complaint."
  ],
];

export default function OvertimePayDisputes() {
  useEffect(() => {
    document.title =
      "Best Overtime & Pay Dispute Lawyers in El Paso, TX | Compare Attorneys";

    const description =
      "Compare El Paso overtime and pay dispute lawyers handling unpaid overtime, off-the-clock work, minimum wage, misclassification, commissions, final paychecks, payroll issues, and wage retaliation.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      "https://www.elpasosbestlawyers.com/el-paso-overtime-pay-disputes-lawyers"
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Employment Law Directory
        </p>

        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Best Overtime & Pay Dispute Lawyers in El Paso, TX
        </h1>

        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">
          Compare El Paso overtime and pay dispute lawyers and employment
          attorneys handling unpaid overtime, off-the-clock work, minimum wage,
          misclassification, commissions, final paychecks, payroll issues, and
          retaliation connected to wage complaints.
        </p>

        <p className="mt-5 max-w-5xl leading-7 text-slate-300">
          Pay disputes can depend on time records, job duties, compensation
          plans, payroll practices, worker classification, and the law that
          applies. This directory helps users compare participating El Paso
          employment attorneys by relevant wage-and-hour experience.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Common Overtime and Pay Disputes
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
              What to Preserve for a Pay Dispute
            </h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Pay stubs and payroll statements</li>
              <li>• Time sheets, schedules, and clock records</li>
              <li>• Employment agreements and compensation plans</li>
              <li>• Emails, texts, and workplace policies</li>
              <li>• Notes showing hours worked and amounts paid</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">
              How to Compare Overtime & Wage Attorneys
            </h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Experience with overtime and unpaid wage disputes</li>
              <li>• Familiarity with worker classification issues</li>
              <li>• Experience reviewing timekeeping and payroll records</li>
              <li>• Experience with retaliation connected to wage complaints</li>
              <li>• Clear communication about fees, deadlines, and strategy</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Overtime and Pay Disputes in El Paso
          </h2>

          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              El Paso workers may encounter pay disputes involving overtime,
              timekeeping, bonuses, commissions, deductions, final pay, or
              classification. The legal analysis may depend on the worker's
              actual duties, compensation method, hours worked, employer
              records, and applicable federal or Texas law.
            </p>

            <p>
              Wage disputes can also overlap with retaliation, wrongful
              termination, employment contracts, or workplace discrimination.
              Preserving payroll records and workplace communications can help
              an attorney evaluate what issues may be present.
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
              to="/el-paso-wage-hour-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Wage & Hour Lawyers
            </Link>

            <Link
              to="/el-paso-wrongful-termination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Wrongful Termination Lawyers
            </Link>

            <Link
              to="/el-paso-workplace-discrimination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Workplace Discrimination Lawyers
            </Link>

            <Link
              to="/el-paso-age-discrimination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Age Discrimination Lawyers
            </Link>

            <Link
              to="/el-paso-sex-discrimination-lawyers"
              className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400"
            >
              Sex Discrimination Lawyers
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
