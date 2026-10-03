import { Link } from "react-router-dom";
import LeadCaptureForm from "../components/LeadCaptureForm";
import { useSeo } from "../hooks/use-seo";

const issues = [
  "Minimum Wage Claims", "Unpaid Wages", "Overtime Pay", "Off-the-Clock Work",
  "Employee Misclassification", "Independent Contractor Classification",
  "Timekeeping and Payroll Problems", "Final Paycheck Disputes",
  "Unpaid Commissions or Bonuses", "Payroll Deductions",
  "Tip and Service Charge Issues", "Wage Complaint Retaliation",
];

const faqs = [
  ["What kinds of wage and hour issues can an employment lawyer review?", "Wage and hour lawyers may review minimum wage claims, unpaid wages, overtime, off-the-clock work, worker classification, payroll deductions, commissions, bonuses, final pay, timekeeping practices, and retaliation connected to wage complaints."],
  ["What records should I preserve for a wage claim?", "Keep pay stubs, time sheets, schedules, clock records, payroll statements, employment agreements, compensation or commission plans, workplace policies, emails, texts, and notes showing the hours worked and amounts paid."],
  ["Can worker classification affect wage and overtime rights?", "Potentially. Wage rights can depend on whether a worker is properly classified and, for employees, whether an overtime exemption applies. The analysis generally depends on the actual work relationship, job duties, compensation method, and applicable law rather than a job title alone."],
  ["What if my main issue is unpaid overtime?", "Unpaid overtime is a wage and hour issue, but workers whose primary concern is overtime can also compare attorneys on the dedicated El Paso Overtime & Pay Disputes directory."],
  ["Can commissions, bonuses, deductions, or final pay create wage disputes?", "Yes. Compensation disputes can involve commissions, bonuses, deductions, final wages, or other promised or legally required pay. The relevant agreement, payroll records, policies, and applicable law can affect the analysis."],
  ["Can retaliation be part of a wage dispute?", "Retaliation issues may arise when a worker reports wage concerns or exercises certain protected rights. Timing, communications, discipline, scheduling changes, termination, and other workplace records can be important to an attorney's review."],
];

export default function WageHour() {
  useSeo({
    title: "Best Wage & Hour Lawyers in El Paso, TX | Compare Attorneys",
    description: "Compare El Paso wage and hour lawyers handling minimum wage, unpaid wages, overtime, off-the-clock work, misclassification, payroll deductions, commissions, final pay, and wage retaliation.",
    path: "/el-paso-wage-hour-lawyers",
  });

  return (
    <main className="min-h-screen bg-[#0b1529] text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-amber-400">El Paso Employment Law Directory</p>
        <h1 className="max-w-5xl text-4xl font-medium leading-tight text-amber-400 md:text-6xl">Best Wage & Hour Lawyers in El Paso, TX</h1>
        <p className="mt-7 max-w-5xl text-xl leading-8 text-slate-100">Compare El Paso wage and hour lawyers and employment attorneys handling minimum wage, unpaid wages, overtime, off-the-clock work, misclassification, payroll deductions, commissions, final pay, and retaliation connected to wage complaints.</p>
        <p className="mt-5 max-w-5xl leading-7 text-slate-300">Wage and hour disputes can involve how time is recorded, how workers are classified, what compensation was promised or required, and whether all wages were paid. This directory helps users compare participating El Paso employment attorneys for wage-related matters.</p>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Common Wage & Hour Issues</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {issues.map((item) => <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-5 py-5 font-semibold">{item}</div>)}
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">What to Preserve for a Wage & Hour Dispute</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Pay stubs and payroll statements</li><li>• Time sheets, schedules, and clock records</li>
              <li>• Employment agreements and compensation plans</li><li>• Commission, bonus, and deduction records</li>
              <li>• Emails, texts, policies, and wage complaints</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-7">
            <h2 className="text-2xl font-medium">How to Compare Wage & Hour Attorneys</h2>
            <ul className="mt-5 space-y-3 text-slate-200">
              <li>• Experience with wage and hour disputes</li><li>• Familiarity with classification and exemption issues</li>
              <li>• Experience reviewing payroll and timekeeping records</li><li>• Experience with commissions, deductions, and final pay</li>
              <li>• Clear communication about fees, deadlines, and strategy</li>
            </ul>
          </article>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Wage & Hour Issues in El Paso</h2>
          <div className="mt-5 max-w-5xl space-y-5 leading-7 text-slate-300">
            <p>El Paso workers may encounter wage disputes involving minimum wage, unpaid time, overtime, payroll practices, deductions, commissions, bonuses, final pay, or worker classification. The analysis may depend on job duties, compensation method, hours worked, employer records, agreements, and applicable federal or Texas law.</p>
            <p>Wage and hour matters can arise across industries including construction, transportation and logistics, hospitality, retail, healthcare, manufacturing, professional services, and other El Paso workplaces. Preserving payroll records and workplace communications can help an attorney evaluate the issues involved.</p>
            <p>If unpaid overtime or a specific pay dispute is the central issue, visit the{" "}<Link to="/el-paso-overtime-pay-disputes-lawyers" className="font-semibold text-amber-400 hover:underline">El Paso Overtime & Pay Dispute Lawyers</Link>{" "}directory for a more focused comparison.</p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-medium">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(([question, answer]) => (
              <article key={question} className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-6">
                <h3 className="text-xl font-semibold text-amber-400">{question}</h3>
                <p className="mt-3 leading-7 text-slate-300">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">Explore Related El Paso Employment Law Directories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/el-paso-employment-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Employment Lawyers</Link>
            <Link to="/el-paso-overtime-pay-disputes-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Overtime & Pay Dispute Lawyers</Link>
            <Link to="/el-paso-wrongful-termination-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Wrongful Termination Lawyers</Link>
            <Link to="/el-paso-workplace-discrimination-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Workplace Discrimination Lawyers</Link>
            <Link to="/el-paso-employment-contract-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Employment Contract Lawyers</Link>
            <Link to="/el-paso-retaliation-lawyers" className="rounded-lg border border-slate-600 px-4 py-3 hover:border-amber-400">Retaliation Lawyers</Link>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-400/30 bg-slate-900/60 p-8">
          <h2 className="text-3xl font-medium">Get Help With a Wage & Hour Issue</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">Tell us briefly about the wage issue. Your request will be recorded as a Wage & Hour inquiry so El Paso&apos;s Best Lawyers can help identify relevant local legal options.</p>
          <div className="mt-6"><LeadCaptureForm practiceArea="Wage & Hour" phoneOptional /></div>
        </section>

        <section className="mt-14 border-t border-slate-700 pt-8 text-sm leading-6 text-slate-400">
          El Paso&apos;s Best Lawyers is a lawyer directory and informational resource. It is not a law firm and does not provide legal advice.
        </section>
      </section>
    </main>
  );
}
