import { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    priceMonth: 29.99,
    features: [
      'Law firm basic information',
      'Name, contact info & address',
      'Up to 3 practice areas',
      'Logo and cover photo',
      'Appears in search results',
      'Lead contact form'
    ],
    stripePriceId: 'price_basic_monthly',
    isFeatured: false,
    attorneyProfileLimit: 0,
    additionalAttorneyPrice: 1.00
  },
  {
    id: 'professional',
    name: 'Professional',
    priceMonth: 79.99,
    features: [
      'All Basic features',
      'Up to 3 attorney profiles',
      'Unlimited practice areas',
      'Photo gallery',
      'Client reviews & ratings',
      'Featured placement',
      'Priority in search results'
    ],
    stripePriceId: 'price_professional_monthly',
    isFeatured: true,
    attorneyProfileLimit: 3,
    additionalAttorneyPrice: 1.00
  },
  {
    id: 'expert',
    name: 'Expert',
    priceMonth: 149.99,
    features: [
      'All Professional features',
      'Up to 10 attorney profiles',
      'Top-of-page placement',
      'Video showcase',
      'Case highlights section',
      'Featured badge site-wide',
      'Maximum exposure'
    ],
    stripePriceId: 'price_expert_monthly',
    isFeatured: true,
    attorneyProfileLimit: 10,
    additionalAttorneyPrice: 1.00
  }
];


