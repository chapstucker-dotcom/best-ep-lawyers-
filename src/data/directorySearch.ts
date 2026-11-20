import { categories, type PracticeArea } from './categories';
import type { Firm } from './types';

// Search-only vocabulary. Never changes stored category IDs or placement eligibility.
const aliases: Record<string, string[]> = {
  'personal-injury': ['injury law', 'injury lawyer', 'injury attorney'],
  'car-accidents': ['auto accident', 'automobile accident', 'motor vehicle accident', 'car crash', 'auto crash', 'car wreck', 'car collision', 'motor vehicle collision'],
  'truck-accidents': ['18 wheeler accident', 'semi truck accident', 'commercial truck accident', 'truck crash', 'tractor trailer accident'],
  'motorcycle-accidents': ['motorcycle crash', 'motorbike accident'],
  'rideshare-accidents': ['uber accident', 'lyft accident', 'rideshare crash'],
  'brain-injury': ['traumatic brain injury', 'tbi'],
  'criminal-defense': ['criminal attorney', 'criminal lawyer'],
  'dwi-dui': ['dwi', 'dui', 'dwi defense', 'dui defense', 'drunk driving', 'driving while intoxicated', 'driving under the influence'],
  'domestic-violence-defense': ['family violence defense', 'domestic violence defense'],
  'expungement': ['expunction', 'record expungement'],
  'child-custody': ['custody', 'conservatorship'],
  'immigration': ['immigration law'],
  'green-cards': ['permanent residency', 'green card'],
  'employment-law': ['employment', 'labor law'],
  'wrongful-termination': ['wrongful dismissal', 'wrongful firing'],
  'wage-and-hour': ['unpaid wages', 'unpaid overtime', 'wage hour'],
  'real-estate': ['real estate law'],
  'landlord-tenant': ['landlord tenant law', 'eviction', 'tenant rights'],
  'estate-planning': ['estate planning and probate'],
  'workers-compensation': ['workers comp', 'worker compensation', 'workers compensation'],
  'social-security-disability': ['ssdi', 'social security disability benefits'],
  'insurance-disputes': ['insurance dispute', 'insurance claim dispute', 'property insurance claim'],
};

// Singular/plural normalization is deliberately limited to clear variants.
const singular: Record<string, string> = {
  accidents: 'accident', crashes: 'crash', collisions: 'collision', wrecks: 'wreck',
  injuries: 'injury', crimes: 'crime', charges: 'charge', violations: 'violation',
  lawyers: 'lawyer', attorneys: 'attorney', firms: 'firm', claims: 'claim',
  disputes: 'dispute', cards: 'card', visas: 'visa', contracts: 'contract',
  agreements: 'agreement', wills: 'will', trusts: 'trust', bites: 'bite',
  appeals: 'appeal', orders: 'order', rights: 'right', workers: 'worker',
  benefits: 'benefit', cases: 'case', taxes: 'tax',
};

export const normalizeDirectoryText = (value: unknown): string =>
  String(value ?? '').toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim().split(/\s+/).map((word) => Object.prototype.hasOwnProperty.call(singular, word) ? singular[word] : word).join(' ');

const phraseIn = (text: string, phrase: string): boolean =>
  Boolean(phrase) && ` ${text} `.includes(` ${phrase} `);

const categoryTerms = new Map(categories.map((area) => [area.slug,
  Array.from(new Set([area.title, area.slug, ...(aliases[area.slug] ?? [])].map(normalizeDirectoryText)))
]));

const termsFor = (area: PracticeArea): string[] => categoryTerms.get(area.slug) ?? [];

// Strip only common search suffixes/locations when resolving a known area.
const areaQuery = (query: string): string => normalizeDirectoryText(query)
  .replace(/\b(?:in el paso(?: tx| texas)?|near me|el paso(?: tx| texas)?)\b/g, ' ')
  .replace(/\b(?:lawyer|attorney|law firm|firm)\b/g, ' ')
  .replace(/\s+/g, ' ').trim();

// These short forms are useful as query intent, but too broad to count as
// evidence that a firm handles a specific practice area.
const queryOnlyAliases: Record<string, string> = {
  injury: 'personal-injury', criminal: 'criminal-defense', family: 'family-law',
  business: 'business-law', corporate: 'business-law', employment: 'employment-law',
};

export function resolveDirectoryArea(query: string): PracticeArea | undefined {
  const clean = areaQuery(query);
  if (!clean) return undefined;
  const raw = normalizeDirectoryText(query);
  return categories.find((area) => termsFor(area).includes(raw)) ??
    categories.find((area) => termsFor(area).includes(clean)) ??
    categories.find((area) => area.slug === queryOnlyAliases[clean]);
}

export function directorySuggestions(query: string): string[] {
  const clean = areaQuery(query);
  if (clean.length < 2) return [];
  const exact = resolveDirectoryArea(query);
  return categories.filter((area) => area.slug === exact?.slug || termsFor(area).some((term) => term.includes(clean)))
    .sort((a, b) => Number(b.slug === exact?.slug) - Number(a.slug === exact?.slug))
    .slice(0, 6).map((area) => area.title);
}

const broadAreas = new Set([
  'personal-injury', 'criminal-defense', 'criminal-law', 'family-law', 'immigration',
  'business-law', 'estate-planning', 'employment-law', 'real-estate', 'bankruptcy', 'civil-litigation',
]);

const structuredAreas = (firm: Firm): string[] => [
  firm.primary_category, firm.category,
  ...(firm.categories ?? []), ...(firm.practice_areas ?? []), ...(firm.specialties ?? []),
].map(normalizeDirectoryText).filter(Boolean);

const profileText = (firm: Firm): string => normalizeDirectoryText([firm.description, firm.bio, firm.blurb].filter(Boolean).join(' '));

export function scoreDirectoryCategory(firm: Firm, slug: string): number {
  if (slug === 'all') return 1;
  const area = categories.find((item) => item.slug === slug);
  if (!area) return 0;
  const structured = structuredAreas(firm);
  const profile = profileText(firm);
  const directTerms = termsFor(area);
  if (structured.some((value) => directTerms.includes(value))) return 100;
  if (structured.some((value) => directTerms.some((term) => phraseIn(value, term)))) return 90;
  // General practice searches may include explicitly listed sub-specialties;
  // a general practice area never qualifies a firm for a narrow specialty.
  if (broadAreas.has(slug)) {
    const related = categories.filter((item) => item.category === area.category).flatMap(termsFor);
    const group = normalizeDirectoryText(area.category);
    if (structured.some((value) => value === group || related.some((term) => phraseIn(value, term)))) return 80;
    if (directTerms.some((term) => phraseIn(profile, term))) return 60;
    if (related.some((term) => phraseIn(profile, term))) return 50;
  }
  if (directTerms.some((term) => phraseIn(profile, term))) return 60;
  return 0;
}

const genericWords = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'at', 'for', 'to', 'with', 'my', 'me', 'i', 'need', 'find', 'want', 'help', 'law', 'lawyer', 'attorney', 'firm', 'el', 'paso', 'tx', 'texas', 'near']);

export function scoreDirectoryText(firm: Firm, query: string): number {
  const clean = normalizeDirectoryText(query);
  if (!clean) return 1;
  const name = normalizeDirectoryText(firm.name);
  if (clean === name) return 200;
  if (phraseIn(name, clean)) return 160;
  const words = Array.from(new Set(clean.split(' ').filter((word) => !genericWords.has(word))));
  if (!words.length) return 0;
  const matchesAll = (text: string) => words.every((word) => phraseIn(text, word));
  if (matchesAll(name)) return 140;
  const structured = structuredAreas(firm).join(' ');
  if (matchesAll(structured)) return 100;
  const combined = [name, structured, profileText(firm)].join(' ');
  // Not an OR: all meaningful query words must occur in the public profile.
  return matchesAll(combined) ? 50 : 0;
}
