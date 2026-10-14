import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../../src/App.tsx";
import MetaPixelTracker from "../../src/components/MetaPixelTracker";

export function renderPersonalInjury(): string {
  const html = renderToString(
    <StaticRouter location="/el-paso-personal-injury-lawyers/">
      <MetaPixelTracker />
      <App />
    </StaticRouter>
  );

  const h1Count = (html.match(/<h1\b/g) ?? []).length;

  if (h1Count !== 1) {
    throw new Error(`Expected one H1, found ${h1Count}`);
  }

  return html;
}

console.log(
  `Personal Injury SSR: ${renderPersonalInjury().length} HTML characters`
);
