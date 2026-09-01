import { useEffect } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What can qualify as sex discrimination in the workplace?",
    answer:
      "Sex discrimination generally involves unfavorable workplace treatment because of sex or a related protected characteristic. Depending on the facts and applicable law, disputes may involve hiring, firing, promotion, compensation, discipline, job assignments, workplace policies, harassment, or other employment decisions.",
  },
  {
    question: "Can sex discrimination involve unequal pay or promotions?",
    answer:
      "Yes. Employment disputes may involve allegations that compensation, raises, promotions, job opportunities, assignments, or other workplace benefits were affected by sex. The legal analysis depends on the facts, comparison evidence, employer explanations, and applicable law.",
  },
  {
    question: "Can pregnancy discrimination be a form of sex discrimination?",
    answer:
      "Pregnancy-related workplace treatment can raise discrimination issues under applicable employment laws. Depending on the circumstances, a dispute may involve hiring, leave, accommodations, scheduling, discipline, termination, or other employment actions.",
  },
  {
    question: "Can retaliation occur after reporting sex discrimination?",
    answer:
      "Retaliation can raise separate legal issues when adverse workplace treatment follows certain protected complaints, reports, requests, or participation in a protected process. Timing, documentation, and the employer's stated reason for the action can be important.",
  },
  {
    question: "What evidence may help document workplace sex discrimination?",
    answer:
      "Relevant evidence may include emails, text messages, performance reviews, pay records, promotion records, workplace policies, complaints, disciplinary documents, termination notices, witness information, and a timeline of important events.",
  },
];

export default function SexDiscrimination() {
  useEffect(() => {
    document.title =
      "Best Sex Discrimination Lawyers in El Paso, TX | Compare Attorneys";

    const description =
      "Compare sex discrimination lawyers in El Paso, TX handling workplace discrimination, unequal treatment, retaliation, harassment, pregnancy-related discrimination, and other employment claims.";

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
      "https://www.elpasosbestlawyers.com/el-paso-sex-discrimination-lawyers"
    );
  }, []);

  const issues = [
    "Unequal pay or compensation",
    "Discriminatory hiring or promotion decisions",
    "Unequal discipline or termination",
    "Pregnancy-related workplace discrimination",
    "Sex-based harassment",
    "Retaliation after reporting discrimination",
    "Unequal job assignments or opportunities",
    "Discriminatory workplace policies",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-400">
            El Paso Employment Law
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Best Sex Discrimination Lawyers in El Paso, TX
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Compare El Paso sex discrimination lawyers and employment attorneys
            handling workplace discrimination, unequal treatment, retaliation,
            harassment, pregnancy-related discrimination, and other employment
            disputes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#compare"
              className="rounded-md bg-amber-400 px-5 py-3 font-semibold text-slate-950"
            >
              Compare El Paso Lawyers
            </a>

            <Link
              to="/"
              className="rounded-md border border-slate-600 px-5 py-3 font-semibold text-white"
            >
              Browse All Practice Areas
            </Link>
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-10">
            <section>
              <h2 className="text-3xl font-bold">
                Finding a Sex Discrimination Lawyer in El Paso
              </h2>

              <p className="mt-4 leading-8 text-slate-700">
                Sex discrimination disputes may involve hiring, firing,
                promotions, compensation, scheduling, job assignments,
                discipline, workplace policies, pregnancy, harassment, or
                retaliation. An employment lawyer can evaluate the facts,
                deadlines, available evidence, and potential claims.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Common Sex Discrimination Issues
              </h2>

              <ul className="mt-5 grid gap-3 text-slate-700 sm:grid-cols-2">
                {issues.map((item) => (
                  <li key={item} className="rounded-lg border p-4">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                What to Bring When Speaking With an Attorney
              </h2>

              <p className="mt-4 leading-8 text-slate-700">
                Useful records may include emails, text messages, performance
                reviews, pay records, employment policies, complaints,
                disciplinary documents, termination notices, witness
                information, and a timeline of important events.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Questions to Ask an El Paso Employment Attorney
              </h2>

              <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-700">
                <li>Do you regularly handle employment discrimination cases?</li>
                <li>What deadlines may apply to my situation?</li>
                <li>What evidence would be most important to preserve?</li>
                <li>What agencies or courts may have jurisdiction?</li>
                <li>How do you charge for this type of representation?</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">
                Frequently Asked Questions
              </h2>

              <div className="mt-6 space-y-4">
                {faqs.map((faq) => (
                  <article
                    key={faq.question}
                    className="rounded-xl border bg-slate-50 p-6"
                  >
                    <h3 className="text-xl font-semibold">
                      {faq.question}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-700">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border bg-slate-50 p-6">
              <h2 className="text-2xl font-bold">
                Compare Sex Discrimination Attorneys in El Paso
              </h2>

              <p className="mt-3 leading-7 text-slate-700">
                El Paso&apos;s Best Lawyers helps consumers compare local
                attorneys by practice area. Review attorney experience,
                services, and firm information before deciding whom to contact.
              </p>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="rounded-xl border p-6">
              <h2 className="text-xl font-bold">Related Practice Areas</h2>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/el-paso-employment-lawyers"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Employment Law
                </Link>

                <Link
                  to="/el-paso-workplace-discrimination-lawyers"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Workplace Discrimination
                </Link>

                <Link
                  to="/el-paso-age-discrimination-lawyers"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Age Discrimination
                </Link>

                <Link
                  to="/el-paso-wrongful-termination-lawyers"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Wrongful Termination
                </Link>

                <Link
                  to="/el-paso-wage-hour-lawyers"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Wage & Hour
                </Link>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-6 text-white">
              <h2 className="text-xl font-bold">For El Paso Law Firms</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Attorneys and firms can learn about listing and featured
                placement opportunities on El Paso&apos;s Best Lawyers.
              </p>

              <Link
                to="/pricing"
                className="mt-5 inline-block rounded-md bg-amber-400 px-4 py-2 font-semibold text-slate-950"
              >
                View Listing Options
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm leading-6 text-slate-600">
            This directory provides general information and is not legal
            advice. Attorney listings and placement should not be interpreted
            as a guarantee of results.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Last updated September 1, 2026.
          </p>
        </div>
      </section>
    </main>
  );
}