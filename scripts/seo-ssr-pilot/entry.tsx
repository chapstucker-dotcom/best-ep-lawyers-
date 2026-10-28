import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../../src/App.tsx";
import MetaPixelTracker from "../../src/components/MetaPixelTracker";

// Called by inject.mjs for each sitemap route. No client-only effects execute during SSR.
export function renderRoute(path: string): string {
  const html = renderToString(
    <StaticRouter location={path}>
      <MetaPixelTracker />
      <App />
    </StaticRouter>
  );
  const count = (html.match(/<h1\b/gi) ?? []).length;
  if (count !== 1) throw new Error(`SSR ${path}: expected exactly one H1, found ${count}`);
  return html;
}
