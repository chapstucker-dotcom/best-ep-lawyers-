import { useEffect } from "react";

const SITE_URL = "https://www.elpasosbestlawyers.com";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  canonical?: boolean;
};

function upsertMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function upsertProperty(property: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

export function useSeo({
  title,
  description,
  path,
  robots = "index, follow",
  canonical = true,
}: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(" | ")
      ? title
      : `${title} | El Paso's Best Lawyers`;

    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = fullTitle;

    upsertMeta("description", description);
    upsertMeta("robots", robots);

    upsertProperty("og:type", "website");
    upsertProperty("og:title", fullTitle);
    upsertProperty("og:description", description);
    upsertProperty("og:site_name", "El Paso's Best Lawyers");

    if (canonical) {
      upsertProperty("og:url", canonicalUrl);

      let canonicalTag =
        document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.rel = "canonical";
        document.head.appendChild(canonicalTag);
      }

      canonicalTag.href = canonicalUrl;
    } else {
      const canonicalTag =
        document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

      canonicalTag?.remove();

      const ogUrl =
        document.querySelector<HTMLMetaElement>('meta[property="og:url"]');

      ogUrl?.remove();
    }
  }, [title, description, path, robots, canonical]);
}