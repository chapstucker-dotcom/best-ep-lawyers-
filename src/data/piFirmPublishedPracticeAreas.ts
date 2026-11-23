/**
 * Firm-published practice areas for Personal Injury cards.
 * Editorial information only; not canonical specialties.
 * Research reviewed November 23, 2026.
 */
export type FirmPublishedPracticeAreas = Readonly<{
  areas: readonly string[];
  sourceUrl: string;
}>;

export const piFirmPublishedPracticeAreas: Readonly<
  Record<string, FirmPublishedPracticeAreas>
> = {
  "cesar-ornelas-injury-law": {
    areas: ["Car accidents", "Truck and 18-wheeler accidents", "Motorcycle accidents", "Workplace injuries", "Wrongful death"],
    sourceUrl: "https://www.cesarornelaslaw.com/faqs/",
  },
  "labinoti-law-firm": {
    areas: ["Truck and commercial vehicle accidents", "Car crashes", "Premises liability", "Medical negligence"],
    sourceUrl: "https://www.labinotilaw.com/about-us/",
  },
  "carter-law-firm": {
    areas: ["Trucking accidents", "Car accidents", "Wrongful death", "Medical malpractice", "Slip and fall"],
    sourceUrl: "https://www.carterlawwins.com/services/",
  },
  "scherr-legate-pllc": {
    areas: ["Workplace accidents", "Trucking accidents", "Construction accidents", "Oilfield accidents", "Traumatic brain injury"],
    sourceUrl: "https://www.scherrlegate.com/we-are-el-pasos-law-firm/",
  },
  "bill-d-hicks": {
    areas: ["Auto accidents", "Product liability", "Slip and fall", "Construction and industrial accidents", "Premises liability"],
    sourceUrl: "https://billhickslaw.com/injury-law/",
  },
  "lozano-meza-law-firm": {
    areas: ["Car accidents", "Semi-truck collisions", "Motorcycle accidents", "Premises liability", "Wrongful death"],
    sourceUrl: "https://www.lozanomeza.com/personal-injury/",
  },
  "cal-mundell-law-firm": {
    areas: ["Car accidents", "Truck accidents", "Motorcycle accidents", "Work accidents", "Wrongful death"],
    sourceUrl: "https://www.calmundelllaw.com/",
  },
  "tawney-acosta-chaparro": {
    areas: ["Car accidents", "Truck accidents", "Oilfield injuries", "Train accidents", "Spinal cord injuries"],
    sourceUrl: "https://tacinjurylaw.com/practice-areas/",
  },
  "bieganowski-law-group": {
    areas: ["Car accidents", "Trucking accidents", "Motorcycle accidents", "Workplace injuries", "Slip and fall"],
    sourceUrl: "https://www.bieganowskilawgroup.com/practice-areas/personal-injury-lawyer",
  },
  "harmonson-law-firm": {
    areas: ["Car and truck accidents", "Premises liability", "Medical malpractice", "Wrongful death", "Brain and spinal cord injuries"],
    sourceUrl: "https://www.clarkharmonsonattorney.com/team/clark-harmonson2/",
  },
  "mission-personal-injury-lawyers": {
    areas: ["Car accidents", "Truck accidents", "Slip and fall", "Pedestrian accidents", "Wrongful death"],
    sourceUrl: "https://missionlegalcenter.com/el-paso-personal-injury-lawyer/",
  },
  "david-saucedo": {
    areas: ["Personal injury", "Medical malpractice"],
    sourceUrl: "https://saucedoesq.com/",
  },
};
