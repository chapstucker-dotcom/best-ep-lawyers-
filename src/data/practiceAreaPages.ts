


export type PracticeAreaPageData = {
  path: string;
  title: string;
  description: string;
  topics: string[];
};

export const practiceAreaPages: PracticeAreaPageData[] = [
  {
    path: "/el-paso-probate-lawyers",
    title: "Best Probate Lawyers in El Paso, Texas",
    description: "Compare El Paso probate attorneys handling wills, estate administration, heirship, executor disputes, guardianships, and probate litigation.",
    topics: ["Probating wills", "Estate administration", "Heirship proceedings", "Executor disputes", "Guardianships", "Probate litigation"],
  },
  {
    path: "/el-paso-bankruptcy-lawyers",
    title: "Best Bankruptcy Lawyers in El Paso, Texas",
    description: "Compare El Paso bankruptcy lawyers for Chapter 7, Chapter 13, debt relief, creditor disputes, foreclosure, and business bankruptcy.",
    topics: ["Chapter 7 bankruptcy", "Chapter 13 bankruptcy", "Business bankruptcy", "Debt relief", "Foreclosure defense", "Creditor disputes"],
  },
  {
    path: "/el-paso-employment-lawyers",
    title: "Best Employment Lawyers in El Paso, Texas",
    description: "Compare El Paso employment attorneys handling discrimination, retaliation, harassment, wages, contracts, and workplace disputes.",
    topics: ["Wrongful termination", "Workplace discrimination", "Retaliation", "Harassment", "Wage and hour claims", "Employment contracts"],
  },
  {
    path: "/el-paso-business-lawyers",
    title: "Best Business Lawyers in El Paso, Texas",
    description: "Compare El Paso business attorneys for company formation, contracts, transactions, disputes, partnerships, compliance, and succession planning.",
    topics: ["Business formation", "Contracts", "Partnership agreements", "Commercial transactions", "Business disputes", "Mergers and acquisitions"],
  },
  {
    path: "/el-paso-real-estate-lawyers",
    title: "Best Real Estate Lawyers in El Paso, Texas",
    description: "Compare El Paso real estate attorneys for purchases, sales, leases, title disputes, boundaries, development, and litigation.",
    topics: ["Purchase and sale agreements", "Commercial leases", "Title disputes", "Boundary and easement issues", "Landlord-tenant matters", "Real estate litigation"],
  },
  {
    path: "/el-paso-civil-litigation-lawyers",
    title: "Best Civil Litigation Lawyers in El Paso, Texas",
    description: "Compare El Paso civil litigation attorneys handling contract disputes, business lawsuits, property claims, injunctions, trials, and appeals.",
    topics: ["Contract disputes", "Business litigation", "Property disputes", "Temporary injunctions", "Trials", "Appeals"],
  },
  {
    path: "/el-paso-divorce-lawyers",
    title: "Best Divorce Lawyers in El Paso, Texas",
    description: "Compare El Paso divorce attorneys handling contested divorce, uncontested divorce, custody, support, property division, and maintenance.",
    topics: ["Contested divorce", "Uncontested divorce", "Child custody", "Child support", "Property division", "Spousal maintenance"],
  },
  {
    path: "/el-paso-child-custody-lawyers",
    title: "Best Child Custody Lawyers in El Paso, Texas",
    description: "Compare El Paso child custody attorneys handling conservatorship, visitation, parenting plans, modifications, enforcement, and relocation.",
    topics: ["Conservatorship", "Visitation", "Parenting plans", "Modifications", "Enforcement", "Relocation"],
  },
  {
    path: "/el-paso-car-accident-lawyers",
    title: "Best Car Accident Lawyers in El Paso, Texas",
    description: "Compare El Paso car accident lawyers handling insurance claims, serious injuries, property damage, uninsured motorists, and collision disputes.",
    topics: ["Rear-end collisions", "Intersection crashes", "Uninsured motorists", "Serious injuries", "Insurance disputes", "Property damage"],
  },
  {
    path: "/el-paso-truck-accident-lawyers",
    title: "Best Truck Accident Lawyers in El Paso, Texas",
    description: "Compare El Paso truck accident attorneys handling commercial vehicle crashes, catastrophic injuries, trucking companies, and insurance claims.",
    topics: ["18-wheeler crashes", "Commercial vehicles", "Driver fatigue", "Maintenance failures", "Cargo claims", "Catastrophic injuries"],
  },
  {
    path: "/el-paso-motorcycle-accident-lawyers",
    title: "Best Motorcycle Accident Lawyers in El Paso, Texas",
    description: "Compare El Paso motorcycle accident lawyers handling serious injuries, insurance disputes, road hazards, and collision claims.",
    topics: ["Serious injuries", "Road hazards", "Left-turn collisions", "Insurance claims", "Uninsured drivers", "Wrongful death"],
  },
  {
    path: "/el-paso-wrongful-death-lawyers",
    title: "Best Wrongful Death Lawyers in El Paso, Texas",
    description: "Compare El Paso wrongful death attorneys handling fatal accidents, negligence claims, damages, and representation for surviving families.",
    topics: ["Fatal car accidents", "Truck crashes", "Workplace deaths", "Premises liability", "Medical negligence", "Survival claims"],
  },
  {
    path: "/el-paso-green-card-lawyers",
    title: "Best Green Card Lawyers in El Paso, Texas",
    description: "Compare El Paso green card attorneys handling family petitions, adjustment of status, consular processing, waivers, and permanent residence.",
    topics: ["Family petitions", "Adjustment of status", "Consular processing", "Employment-based cases", "Waivers", "Renewals"],
  },
  {
    path: "/el-paso-citizenship-lawyers",
    title: "Best Citizenship Lawyers in El Paso, Texas",
    description: "Compare El Paso citizenship attorneys handling naturalization, interviews, eligibility, prior immigration issues, and citizenship applications.",
    topics: ["Naturalization applications", "Interview preparation", "Eligibility review", "Prior immigration issues", "Military naturalization", "Citizenship evidence"],
  },
];

export const getPracticeAreaPageByPath = (
  path: string
): PracticeAreaPageData | undefined =>
  practiceAreaPages.find((page) => page.path === path);
