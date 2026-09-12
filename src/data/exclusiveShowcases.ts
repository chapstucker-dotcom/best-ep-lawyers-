import type { AttorneyProfile } from "./attorneyTypes";
import {
  HICKS_DEMO_FIRM_ID,
  hicksExclusiveAttorneys,
  hicksExclusiveFirm,
} from "./hicksExclusiveDemo";

export interface ShowcaseTestimonial {
  quote: string;
  author: string;
}

export interface ShowcaseTestimonials {
  title: string;
  disclosure: string;
  sourceUrl: string;
  sourceLabel: string;
  items: ShowcaseTestimonial[];
}

export interface LocalExclusiveShowcase {
  id: string;
  firm: Record<string, unknown>;
  attorneys: AttorneyProfile[];
  exclusiveCategory?: string;
  testimonials?: ShowcaseTestimonials;
}

const localExclusiveShowcases: Record<string, LocalExclusiveShowcase> = {
  [HICKS_DEMO_FIRM_ID]: {
    id: HICKS_DEMO_FIRM_ID,
    firm: hicksExclusiveFirm,
    attorneys: hicksExclusiveAttorneys,
    exclusiveCategory: "Personal Injury",
    testimonials: {
      title: "Client Testimonials",
      disclosure:
        "Testimonials below are published by The Law Offices of Bill D. Hicks on the firm's website and are not independently verified or endorsed by El Paso's Best Lawyers.",
      sourceUrl: "https://billhickslaw.com/testimonials/",
      sourceLabel: "View Testimonials on Firm Website",
      items: [
        {
          quote:
            "Mr. Hicks was the most professional, timely and effective lawyer I have ever met.",
          author: "Melissa",
        },
        {
          quote:
            "I hold him in high regard for his honesty and integrity.",
          author: "Chris",
        },
        {
          quote:
            "Throughout the process he was honest, straightforward, and available.",
          author: "Leslie",
        },
      ],
    },
  },
};

export const getLocalExclusiveShowcase = (
  id?: string | null
): LocalExclusiveShowcase | null => {
  if (!id) return null;

  return localExclusiveShowcases[id] ?? null;
};

export const isLocalExclusiveShowcaseId = (
  id?: string | null
): boolean => Boolean(getLocalExclusiveShowcase(id));
