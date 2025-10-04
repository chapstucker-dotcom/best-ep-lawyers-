import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Best EP Lawyers</h3>
            <p className="mt-2 text-sm text-gray-600">Helping El Paso residents discover and evaluate local attorneys.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              <li><a className="hover:underline" href="#education">Texas Law Guides</a></li>
              <li><a className="hover:underline" href="#directory">Find a Firm</a></li>
              <li><a className="hover:underline" href="#pricing">Firm Plans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <p className="mt-2 text-sm text-gray-600">This site is informational and not legal advice. © {new Date().getFullYear()} Best EP Lawyers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
