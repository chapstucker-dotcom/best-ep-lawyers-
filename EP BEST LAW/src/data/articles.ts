import { Article } from './types';

export const articles: Article[] = [
  {
    id: '1',
    title: 'How Texas Family Law Handles Child Custody',
    slug: 'texas-child-custody',
    summary: 'Conservatorship, possession schedules, and how judges decide best interest of the child.',
    body: 'Texas family courts focus on the best interest of the child when determining custody arrangements...',
    topic: 'Family',
    faqs: [
      { question: 'What is conservatorship?', answer: 'Conservatorship refers to the legal rights and duties of parents.' },
      { question: 'How is custody decided?', answer: 'Judges consider multiple factors including stability, parenting ability, and child preferences.' }
    ],
    updatedAt: '2025-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'What to Know Before Hiring a Personal Injury Lawyer in Texas',
    slug: 'hiring-pi-lawyer-texas',
    summary: 'Statute of limitations, contingency fees, evidence preservation, and demand letters.',
    body: 'In Texas, personal injury claims generally have a 2-year statute of limitations...',
    topic: 'Personal Injury',
    faqs: [
      { question: 'What is a contingency fee?', answer: 'You only pay attorney fees if you win your case, typically 33-40% of the settlement.' }
    ],
    updatedAt: '2025-09-15T10:00:00Z'
  },
  {
    id: '3',
    title: "Texas DWI vs DUI: What's the Difference?",
    slug: 'texas-dwi-dui-difference',
    summary: 'Blood Alcohol Concentration basics, penalty tiers, license suspensions, ALR hearings.',
    body: 'DWI applies to adults 21+ with BAC of 0.08% or higher. DUI applies to minors under 21 with any detectable alcohol...',
    topic: 'Criminal',
    faqs: [
      { question: 'What is an ALR hearing?', answer: 'Administrative License Revocation hearing determines if your license will be suspended.' }
    ],
    updatedAt: '2025-08-20T10:00:00Z'
  },
  {
    id: '4',
    title: 'Texas Probate Basics',
    slug: 'texas-probate-basics',
    summary: 'Independent vs dependent administration, small estate affidavits, muniment of title, timelines.',
    body: 'Texas offers several probate options depending on the estate size and complexity...',
    topic: 'Probate',
    faqs: [],
    updatedAt: '2025-07-10T10:00:00Z'
  },
  {
    id: '5',
    title: 'Hiring an Immigration Attorney in El Paso',
    slug: 'immigration-attorney-el-paso',
    summary: 'Family-based, removal defense, asylum basics, common documents, bilingual considerations.',
    body: 'El Paso immigration attorneys handle family petitions, deportation defense, and asylum cases...',
    topic: 'Immigration',
    faqs: [],
    updatedAt: '2025-06-05T10:00:00Z'
  }
];


