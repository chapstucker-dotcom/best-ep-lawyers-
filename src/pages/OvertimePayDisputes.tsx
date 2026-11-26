import { useSeo } from "../hooks/use-seo";
import { Link } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm";

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
  useSeo({
    title: "El Paso Overtime & Pay Dispute Lawyers | Unpaid Wages",
    description:
      "Working overtime without proper pay? Explore your options and compare El Paso employment lawyers for unpaid overtime, off-the-clock work and wage disputes.",
    path: "/el-paso-overtime-pay-disputes-lawyers",
  });

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">
          El Paso Employment Law Directory
        </p>

        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">
          Overtime & Pay Dispute Lawyers in El Paso, TX
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

        <section className="mt-14">
          <h2 className="text-3xl font-medium">
            Working Overtime Without Proper Pay?
          </h2>

          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>
              Under federal wage law, covered employees who are not exempt
              generally must receive overtime compensation at least 1.5 times
              their regular pay rate for hours beyond 40 in a workweek.
              Exceptions and special rules may apply.
            </p>

            <p>
              Receiving a salary does not automatically make a worker
              ineligible for overtime. Job duties, compensation arrangements
              and applicable exemptions may affect eligibility.
            </p>

            <h3 className="text-xl font-semibold text-amber-400">
              Possible Signs of Unpaid Working Time
            </h3>

            <ul className="list-disc space-y-3 pl-6">
              <li>Completing required tasks before clocking in.</li>
              <li>Continuing to work after clocking out.</li>
              <li>Performing work during unpaid meal periods.</li>
              <li>Traveling between job sites during the workday.</li>
              <li>Having recorded hours reduced or altered.</li>
              <li>Receiving straight-time pay when overtime may be required.</li>
            </ul>

            <p>
              These circumstances do not automatically establish a violation.
              An employment attorney can evaluate the actual hours worked,
              payroll records, job duties and applicable law.
            </p>

            <p>
              Official guidance is available from the{" "}
              <a
                href="https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-400 underline"
              >
                U.S. Department of Labor
              </a>
              {" "}and its{" "}
              <a
                href="https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-400 underline"
              >
                guidance on compensable working time
              </a>.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#overtime-inquiry"
                className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300"
              >
                Request Legal Assistance
              </a>

              <Link
                to="/el-paso-employment-lawyers"
                className="rounded-lg border border-slate-600 px-6 py-3 font-semibold hover:border-amber-400"
              >
                Explore Employment Lawyers
              </Link>
            </div>
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

        <section id="overtime-inquiry" className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">
            Get Help With an Overtime or Pay Dispute
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            Tell us briefly about the pay issue. Your request will be recorded
            as an overtime and pay dispute inquiry so El Paso&apos;s Best Lawyers
            can help identify relevant local legal options.
          </p>
          <div className="mt-6">
            <LeadCaptureForm
              practiceArea="Overtime & Pay Disputes"
              phoneOptional
            />
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