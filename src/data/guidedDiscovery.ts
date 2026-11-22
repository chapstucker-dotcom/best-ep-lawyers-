import { normalizeDirectoryText } from "./directorySearch";
import { getPracticeAreaByValue } from "./platformModel";

export const suggestPracticeAreas = (
  legalIssue: string
): string[] => {
  const text = normalizeDirectoryText(legalIssue);
  if (!text) return [];

  const rules: Array<{ area: string; terms: string[] }> = [
    { area: 'truck-accidents', terms: ['truck accident', 'truck crash', '18 wheeler', 'semi truck', 'tractor trailer'] },
    { area: 'car-accidents', terms: ['car accident', 'car crash', 'car wreck', 'auto accident', 'motor vehicle accident', 'rear ended'] },
    { area: 'motorcycle-accidents', terms: ['motorcycle accident', 'motorcycle crash'] },
    { area: 'wrongful-death', terms: ['wrongful death', 'fatal accident', 'killed in an accident'] },
    { area: 'catastrophic-injury', terms: ['catastrophic injury', 'serious injury', 'severe injury', 'permanent injury', 'serious injuries'] },
    { area: 'brain-injury', terms: ['brain injury', 'traumatic brain injury', 'tbi'] },
    { area: 'construction-accidents', terms: ['construction accident', 'construction injury'] },
    { area: 'workers-compensation', terms: ['workers compensation', 'workers comp', 'injured at work', 'workplace injury'] },
    { area: 'divorce', terms: ['divorce', 'end my marriage'] },
    { area: 'child-custody', terms: ['child custody', 'custody', 'conservatorship'] },
    { area: 'child-support', terms: ['child support'] },
    { area: 'federal-crimes', terms: ['federal charge', 'federal crime', 'federal indictment'] },
    { area: 'drug-crimes', terms: ['drug charge', 'drug possession'] },
    { area: 'deportation-defense', terms: ['deportation', 'removal proceedings'] },
    { area: 'green-cards', terms: ['green card', 'permanent residency'] },
    { area: 'wrongful-termination', terms: ['wrongful termination', 'wrongfully terminated', 'fired from work'] },
    { area: 'wage-and-hour', terms: ['unpaid wages', 'unpaid overtime', 'overtime pay'] },
    { area: 'landlord-tenant', terms: ['landlord', 'tenant', 'eviction', 'lease dispute'] },
    { area: 'DWI / DUI', terms: ['dwi', 'dui', 'drunk driving', 'driving while intoxicated', 'driving under the influence'] },
    { area: 'Family Law', terms: ['family law', 'divorce', 'child custody', 'custody', 'child support', 'spousal support', 'alimony', 'adoption', 'paternity'] },
    { area: 'Immigration', terms: ['immigration', 'visa', 'green card', 'citizenship', 'deportation', 'asylum', 'naturalization'] },
    { area: 'Bankruptcy', terms: ['bankruptcy', 'chapter 7', 'chapter 13', 'debt relief'] },
    { area: 'Employment Law', terms: ['employment law', 'wrongful termination', 'wrongfully terminated', 'workplace discrimination', 'employment discrimination', 'workplace harassment', 'unpaid wages', 'overtime pay', 'wage and hour', 'fired from work'] },
    { area: 'Personal Injury', terms: ['personal injury', 'car accident', 'auto accident', 'vehicle accident', 'truck accident', 'motorcycle accident', 'slip and fall', 'wrongful death', 'injured in an accident', 'injury claim'] },
    { area: 'Criminal Defense', terms: ['criminal defense', 'criminal charge', 'criminal charges', 'felony', 'misdemeanor', 'arrested', 'probation violation', 'criminal case'] },
    { area: 'Probate', terms: ['probate', 'executor', 'estate administration', 'inheritance dispute', 'heir', 'heirs'] },
    { area: 'Estate Planning', terms: ['estate planning', 'last will', 'living will', 'living trust', 'revocable trust', 'power of attorney', 'create a trust', 'make a will'] },
    { area: 'Real Estate', terms: ['real estate', 'property dispute', 'landlord', 'tenant', 'lease dispute', 'title dispute', 'deed', 'boundary dispute'] },
    { area: 'Business Law', terms: ['business law', 'business dispute', 'business contract', 'corporate', 'corporation', 'llc', 'partnership dispute', 'company dispute'] },
    { area: 'Civil Litigation', terms: ['civil litigation', 'civil lawsuit', 'civil case', 'being sued', 'file a lawsuit', 'lawsuit against'] },
  ];

  const matches = new Set<string>();
  for (const rule of rules) {
    if (rule.terms.some((term) => ` ${text} `.includes(` ${normalizeDirectoryText(term)} `))) {
      const area = getPracticeAreaByValue(rule.area);
      if (area) matches.add(area.slug);
    }
  }
  // Specific accident contexts also warrant browsing the broader injury market.
  if (['truck-accidents', 'car-accidents', 'motorcycle-accidents', 'wrongful-death', 'catastrophic-injury', 'brain-injury', 'construction-accidents'].some(slug => matches.has(slug))) {
    matches.add('personal-injury');
  }
  if (['federal-crimes', 'drug-crimes', 'dwi-dui'].some(slug => matches.has(slug))) matches.add('criminal-defense');
  return [...matches];
};
