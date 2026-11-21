import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { useSeo } from "../hooks/use-seo";

export default function Guides() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!["#consultation-preparation", "#questions-to-ask", "#choosing-an-attorney"].includes(hash)) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  useSeo({
    title: "Texas Law Guides for El Paso | El Paso's Best Lawyers",
    description:
      "Plain-English Texas legal guides for El Paso residents covering car accidents, personal injury, DWI, family law, wrongful death, insurance, and more.",
    path: "/guides",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-bold text-[#0F2A43]">
            El Paso&apos;s Best Lawyers
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2A43] hover:text-[#1FA8A1]"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-[#0F2A43] px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <BookOpen className="mx-auto mb-5 h-12 w-12 text-[#F5B800]" />

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#F5B800]">
              El Paso Legal Resources
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Texas Law Guides for El Paso Residents
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-200">
              Practical, plain-English information connected to the lawyer
              categories people search for most in El Paso.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pt-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-700">Your next steps</p>
            <h2 className="text-3xl font-bold text-[#0F2A43]">Make the most of your first legal consultation</h2>
            <p className="mt-3 text-slate-600">You do not need to know the legal terminology before speaking with a lawyer. These suggestions can help you prepare, compare your options and make an informed decision.</p>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div id="consultation-preparation" className="scroll-mt-6 rounded-xl border p-5">
                <h3 className="text-xl font-bold text-[#0F2A43]">Prepare for your consultation</h3>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                  <li>Write a brief timeline, including important dates and upcoming appointments or hearings.</li>
                  <li>Organize relevant documents, notices, photographs and correspondence. Ask the attorney which records to bring and how to share them securely.</li>
                  <li>Write down your concerns, desired outcome and questions.</li>
                  <li>Confirm the consultation arrangements and whether there is a charge before meeting.</li>
                </ul>
              </div>
              <div id="questions-to-ask" className="scroll-mt-6 rounded-xl border p-5">
                <h3 className="text-xl font-bold text-[#0F2A43]">Questions to ask an attorney</h3>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                  <li>What experience do you have with matters like mine?</li>
                  <li>What options and next steps should I consider?</li>
                  <li>Are there deadlines or urgent issues I should discuss with you?</li>
                  <li>Who would handle my matter, and how would you communicate with me?</li>
                  <li>How do you explain fees, costs and the scope of representation?</li>
                </ul>
              </div>
              <div id="choosing-an-attorney" className="scroll-mt-6 rounded-xl border p-5">
                <h3 className="text-xl font-bold text-[#0F2A43]">Choose with confidence</h3>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
                  <li>Consider relevant experience, qualifications, communication style and whether the attorney understands your goals.</li>
                  <li>Ask who will work on your matter and how updates will be provided.</li>
                  <li>Review the proposed written engagement terms before deciding.</li>
                  <li>Compare firms on facts that matter to you. Advertising placement is not a professional ranking.</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-600">Keep sensitive documents private until the attorney confirms a secure way to share them. These are general preparation suggestions, not legal advice.</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
            <strong>Educational information only.</strong> These guides are not
            legal advice and do not create an attorney-client relationship.
            Laws, procedures, deadlines, and agency practices can change.
            Consult a licensed attorney about a specific matter.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
