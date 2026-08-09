import { Link } from "react-router-dom";
import { ArrowRight, Scale } from "lucide-react";

const priorityLinks = [
  ["Criminal Defense Lawyers", "/el-paso-criminal-defense-lawyers"],
  ["Personal Injury Lawyers", "/el-paso-personal-injury-lawyers"],
  ["Car Accident Lawyers", "/el-paso-car-accident-lawyers"],
  ["Truck Accident Lawyers", "/el-paso-truck-accident-lawyers"],
  ["Wrongful Death Lawyers", "/el-paso-wrongful-death-lawyers"],
  ["Motorcycle Accident Lawyers", "/el-paso-motorcycle-accident-lawyers"],
  ["Family Lawyers", "/el-paso-family-lawyers"],
  ["Divorce Lawyers", "/el-paso-divorce-lawyers"],
  ["Immigration Lawyers", "/el-paso-immigration-lawyers"],
  ["DWI Lawyers", "/el-paso-dwi-lawyers"],
  ["Traffic Ticket Lawyers", "/el-paso-traffic-ticket-lawyers"],
  ["Civil Litigation Lawyers", "/el-paso-civil-litigation-lawyers"],
] as const;

export default function SeoPracticeAreaLinks() {
  return (
    <section className="border-y border-slate-200 bg-white py-16" aria-labelledby="popular-legal-searches">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#021B45] text-[#D4A62A]">
            <Scale className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[#9A7212]">Popular El Paso Legal Searches</p>
          <h2 id="popular-legal-searches" className="mt-2 text-3xl font-bold text-[#021B45] sm:text-4xl">
            Find El Paso lawyers by the legal help you need
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Browse focused local directory pages to compare participating El Paso law firms and attorney profiles by practice area.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {priorityLinks.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-[#021B45] transition hover:-translate-y-0.5 hover:border-[#D4A62A] hover:bg-[#FFF9E8] hover:shadow-sm"
            >
              <span>{label} in El Paso</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
