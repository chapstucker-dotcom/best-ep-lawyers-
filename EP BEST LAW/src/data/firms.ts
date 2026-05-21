import { Firm } from './types';

export const firms: Firm[] = [
  {
    id: '1',
    name: 'Sun City Legal Group',
    slug: 'sun-city-legal-group',
    plan: 'Professional',
    featured: true,
    categories: ['family-law', 'immigration'],
    blurb: 'Bilingual family & immigration practice in El Paso.',
    about: 'Sun City Legal Group provides compassionate, bilingual legal services to El Paso families. Our experienced attorneys handle complex family law matters and immigration cases with personalized attention.',
    phone: '915-555-0123',
    email: 'info@suncitylegal.com',
    website: 'https://suncitylegal.com',
    address: '123 Mesa St, El Paso, TX 79901',
    logo: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400707415_7d407b83.webp',
    coverImage: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400702389_1f94cc57.webp',
    reviewsEnabled: true,
    faqs: [
      { question: 'Do you offer bilingual services?', answer: 'Yes, we provide full services in English and Spanish.' },
      { question: 'What are your consultation fees?', answer: 'Initial consultations are free for family law and immigration cases.' }
    ],
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Borderline Defense',
    slug: 'borderline-defense',
    plan: 'Basic',
    featured: false,
    categories: ['criminal-law'],
    blurb: 'DWI and criminal defense.',
    about: 'Borderline Defense specializes in criminal defense with a focus on DWI cases. We fight for your rights.',
    phone: '915-555-0456',
    email: 'team@borderlinedefense.com',
    website: 'https://borderlinedefense.com',
    address: '456 Stanton St, El Paso, TX 79901',
    logo: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400709133_ef663fb1.webp',
    coverImage: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400704922_b0505a42.webp',
    reviewsEnabled: false,
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Rio Grande Injury',
    slug: 'rio-grande-injury',
    plan: 'Expert',
    featured: true,
    categories: ['personal-injury'],
    blurb: 'Serious injury litigation.',
    about: 'Rio Grande Injury represents victims of serious accidents and medical malpractice. No fees unless we win your case.',
    phone: '915-555-0789',
    email: 'hello@riograndeinjury.com',
    website: 'https://riograndeinjury.com',
    address: '789 Yandell Dr, El Paso, TX 79902',
    logo: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400710856_feb3eeaf.webp',
    coverImage: 'https://d64gsuwffb70l.cloudfront.net/68ed9016467af1e849aff0b4_1760400706648_d386976b.webp',
    reviewsEnabled: true,
    faqs: [
      { question: 'Do I pay upfront?', answer: 'No, we work on contingency. You only pay if we win.' },
      { question: 'How long do cases take?', answer: 'Most personal injury cases settle within 6-18 months.' }
    ],
    createdAt: '2024-11-10T10:00:00Z'
  }
];
