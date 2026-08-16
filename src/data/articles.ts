export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleSource = {
  name: string;
  url: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  summary: string;
  topic: string;
  readTime: string;
  updatedAt: string;
  relatedPracticeArea: { label: string; path: string };
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  sources: ArticleSource[];
};

export const articles: Article[] = [
  {
    id: 'car-accident-steps',
    slug: 'what-to-do-after-car-accident-el-paso',
    title: 'What to Do After a Car Accident in El Paso, Texas',
    metaDescription: 'A practical El Paso car accident checklist covering safety, medical care, crash reports, evidence, insurance, and when to speak with a lawyer.',
    summary: 'A practical checklist for the first hours and days after an El Paso crash, including medical care, evidence, insurance, and Texas crash reports.',
    topic: 'Car Accidents',
    readTime: '7 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Car Accident Lawyers', path: '/el-paso-car-accident-lawyers' },
    sections: [
      { heading: 'Start with safety and medical care', paragraphs: ['After a collision, move out of active traffic when it is safe to do so and call 911 when anyone may be injured or the scene is dangerous. Even when injuries do not appear severe at first, symptoms can develop later. A medical evaluation also creates a contemporaneous record of your condition.', 'Do not delay emergency care because you are worried about fault, insurance, or a future claim. Health and safety come first.'] },
      { heading: 'Document the scene before evidence disappears', paragraphs: ['If you can do so safely, photograph vehicle positions, damage, license plates, traffic signals, road conditions, skid marks, debris, and visible injuries. Get names and contact information for witnesses. Save dash-camera footage, rideshare records, text messages, and any other digital evidence connected to the crash.'], bullets: ['Photograph all vehicles from multiple angles.', 'Save the other driver’s insurance and contact information.', 'Write down the exact location, time, weather, and direction of travel.', 'Preserve damaged property rather than immediately discarding it.'] },
      { heading: 'Get the Texas crash report when one exists', paragraphs: ['TxDOT is the state custodian of Texas crash records. Texas law requires an investigating peace officer to submit a written crash report to TxDOT for qualifying crashes involving injury, death, or apparent property damage of $1,000 or more to any one person. TxDOT provides an online system for eligible people to purchase a CR-3 peace officer crash report.', 'The report can be useful, but it is only one piece of evidence. Photographs, video, witnesses, vehicle data, medical records, and other information may also matter.'] },
      { heading: 'Be careful with insurance communications', paragraphs: ['Report the crash to your own insurer as required by your policy. Before giving a detailed recorded statement to another driver’s insurer or signing a broad medical authorization or release, consider getting legal advice if injuries are significant, fault is disputed, or coverage is complicated.', 'Keep copies of repair estimates, medical bills, wage-loss documents, rental-car receipts, and communications with insurers.'] },
    ],
    faqs: [
      { question: 'Should I call police after an El Paso car accident?', answer: 'Call 911 when someone may be injured, the roadway is unsafe, a driver leaves the scene, or emergency assistance is needed. Texas law also requires officer crash reporting for certain qualifying crashes.' },
      { question: 'How do I get a Texas crash report?', answer: 'TxDOT provides an online Crash Report Purchase System for eligible requesters seeking a Texas Peace Officer’s Crash Report (CR-3).' },
      { question: 'When should I contact a car accident lawyer?', answer: 'Consider legal advice promptly when injuries are serious, fault is disputed, a commercial or rideshare vehicle is involved, insurance coverage is unclear, or important evidence may disappear.' },
    ],
    sources: [
      { name: 'Texas Department of Transportation — Crash reports and records', url: 'https://www.txdot.gov/data-maps/crash-reports-records.html' },
      { name: 'Texas Civil Practice & Remedies Code Chapter 16', url: 'https://statutes.capitol.texas.gov/Docs/CP/htm/CP.16.htm' },
    ],
  },
  {
    id: 'texas-pi-deadline',
    slug: 'texas-car-accident-statute-of-limitations',
    title: 'How Long Do You Have to File a Car Accident Claim in Texas?',
    metaDescription: 'Texas generally has a two-year limitations period for personal injury claims. Learn why exceptions, notice rules, and evidence preservation can make earlier action important.',
    summary: 'Texas generally uses a two-year limitations period for personal injury claims, but exceptions and special notice rules can change the analysis.',
    topic: 'Personal Injury',
    readTime: '6 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Personal Injury Lawyers', path: '/el-paso-personal-injury-lawyers' },
    sections: [
      { heading: 'The general Texas rule', paragraphs: ['Texas Civil Practice and Remedies Code Section 16.003 generally requires a person to bring a personal injury suit no later than two years after the cause of action accrues. The same section generally provides a two-year period for an action for injury resulting in death, measured from the death of the injured person.', 'That general rule is important, but it should not be treated as a universal deadline for every accident-related claim.'] },
      { heading: 'Why waiting until the deadline is risky', paragraphs: ['A legal deadline is not the same thing as a recommended waiting period. Video can be overwritten, witnesses can become difficult to locate, vehicles can be repaired or destroyed, and electronic data can disappear. Early investigation can preserve evidence before it is lost.', 'Claims involving government entities, minors, certain medical issues, or unusual parties can involve different rules or notice requirements. A lawyer can evaluate the deadline that applies to the specific facts.'] },
      { heading: 'Insurance deadlines are different from lawsuit deadlines', paragraphs: ['Insurance policies may require prompt notice, cooperation, proof of loss, or other actions. Those contractual requirements are separate from the statute of limitations for filing a lawsuit. Do not assume that having two years means every insurance requirement can wait two years.'] },
    ],
    faqs: [
      { question: 'Is the Texas car accident deadline always two years?', answer: 'No. Two years is a common general limitations period for personal injury, but exceptions, tolling rules, special defendants, and other laws can change the deadline.' },
      { question: 'Does negotiating with an insurer stop the deadline?', answer: 'Do not assume negotiations automatically pause a legal deadline. The effect of any agreement or legal rule should be evaluated specifically.' },
    ],
    sources: [
      { name: 'Texas Civil Practice & Remedies Code §16.003', url: 'https://statutes.capitol.texas.gov/Docs/CP/htm/CP.16.htm' },
    ],
  },
  {
    id: 'uninsured-driver',
    slug: 'uninsured-driver-accident-texas',
    title: 'What Happens if the Driver Who Hit You Is Uninsured in Texas?',
    metaDescription: 'Learn how uninsured and underinsured motorist coverage can matter after a Texas crash and what evidence to preserve after an uninsured-driver accident.',
    summary: 'Texas law requires insurers to offer uninsured/underinsured motorist coverage unless it is rejected as permitted by law. Here is what to review after a crash.',
    topic: 'Car Accidents',
    readTime: '6 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Car Accident Lawyers', path: '/el-paso-car-accident-lawyers' },
    sections: [
      { heading: 'Start by checking every potentially applicable policy', paragraphs: ['Texas Insurance Code Chapter 1952 requires uninsured/underinsured motorist coverage to be provided with an automobile liability policy unless the coverage is rejected as allowed by law. The coverage is intended to protect insured people who are legally entitled to recover damages from owners or operators of uninsured or underinsured motor vehicles, subject to the policy and Texas law.', 'After an accident, review the declarations page and the full policy rather than relying on memory about what coverage was purchased.'] },
      { heading: 'Uninsured and underinsured are not the same', paragraphs: ['An uninsured driver generally lacks collectible liability coverage. An underinsured driver has coverage, but the available liability limits may be insufficient compared with the damages. The policy language and circumstances determine what coverage may apply.'] },
      { heading: 'Preserve evidence of the crash and coverage', paragraphs: ['Keep the police report, photographs, witness information, medical records, repair records, policy documents, and all insurance correspondence. If the other driver left the scene, preserve surveillance video and witness information quickly.'] },
    ],
    faqs: [
      { question: 'Does every Texas driver have UM/UIM coverage?', answer: 'Texas insurers generally must provide uninsured/underinsured motorist coverage unless it is rejected as permitted by law. The actual policy should be reviewed to determine what coverage exists.' },
      { question: 'Can UM/UIM cover a hit-and-run?', answer: 'Coverage can depend on the policy terms and Texas law. Texas statutes include specific rules for unknown motorists, so the facts should be reviewed carefully.' },
    ],
    sources: [
      { name: 'Texas Insurance Code Chapter 1952 — Uninsured/Underinsured Motorist Coverage', url: 'https://statutes.capitol.texas.gov/Docs/IN/htm/IN.1952.htm' },
    ],
  },
  {
    id: 'texas-crash-report',
    slug: 'how-to-get-texas-crash-report-el-paso',
    title: 'How to Get a Texas Crash Report After an El Paso Accident',
    metaDescription: 'Learn what a Texas CR-3 crash report is, when law enforcement submits one, and how eligible requesters can obtain a copy from TxDOT.',
    summary: 'A plain-English guide to Texas CR-3 peace officer crash reports and the TxDOT crash-records system.',
    topic: 'Car Accidents',
    readTime: '5 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Car Accident Lawyers', path: '/el-paso-car-accident-lawyers' },
    sections: [
      { heading: 'What is a CR-3?', paragraphs: ['The CR-3 is the Texas Peace Officer’s Crash Report used by law enforcement. TxDOT says Texas Transportation Code Section 550.062 requires an officer who investigates a qualifying crash involving injury, death, or apparent property damage of $1,000 or more to any one person to submit a written report to TxDOT no later than the tenth day after the crash.'] },
      { heading: 'Where to request the report', paragraphs: ['TxDOT maintains the Crash Report Online Purchase System. Crash reports are confidential under Texas law and are not simply open for general public browsing, so requesters must satisfy the applicable access requirements.', 'TxDOT currently lists separate prices for regular and certified copies. Check the TxDOT page for current fees and procedures before ordering.'] },
      { heading: 'What the report can and cannot tell you', paragraphs: ['A crash report may identify drivers, vehicles, insurers, witnesses, roadway information, and the officer’s recorded observations. It can be useful for an insurance claim or investigation.', 'It is not necessarily the final word on civil fault. Other evidence—video, photographs, witnesses, vehicle data, phone records, roadway evidence, and expert analysis—may also matter.'] },
    ],
    faqs: [
      { question: 'How soon is a Texas crash report submitted?', answer: 'For qualifying crashes, TxDOT states that the investigating officer must submit the written report no later than the tenth day after the crash.' },
      { question: 'Are Texas crash reports public?', answer: 'TxDOT states that crash reports are confidential and access is governed by Texas Transportation Code Section 550.065.' },
    ],
    sources: [
      { name: 'TxDOT — Crash reports and records', url: 'https://www.txdot.gov/data-maps/crash-reports-records.html' },
    ],
  },
  {
    id: 'truck-evidence',
    slug: 'truck-accident-evidence-texas',
    title: 'What Evidence Matters After a Truck Accident in Texas?',
    metaDescription: 'Truck crashes can involve electronic logs, vehicle data, maintenance records, dash video, dispatch communications, and multiple companies. Learn what evidence may matter.',
    summary: 'Commercial-truck cases can involve evidence that does not exist in an ordinary passenger-car crash, making early preservation especially important.',
    topic: 'Truck Accidents',
    readTime: '7 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Truck Accident Lawyers', path: '/el-paso-truck-accident-lawyers' },
    sections: [
      { heading: 'Commercial crashes can involve multiple evidence sources', paragraphs: ['A serious truck crash may involve the driver, motor carrier, trailer owner, maintenance contractor, shipper, broker, cargo loader, insurer, or another company. Each may possess different records.', 'Potential evidence can include electronic logging device records, onboard vehicle data, dash-camera video, inspection records, maintenance files, dispatch communications, cargo documents, driver qualification records, drug and alcohol testing records, and company safety policies.'] },
      { heading: 'Why preservation matters', paragraphs: ['Some electronic and business records are kept only for limited periods. A prompt preservation request can help identify and preserve materials before they are routinely overwritten or discarded.', 'Independent scene evidence also matters: photographs, measurements, witness accounts, surveillance video, crash reports, medical records, and damaged vehicles can all help reconstruct what occurred.'] },
      { heading: 'El Paso truck corridors create local issues', paragraphs: ['El Paso commercial-vehicle traffic frequently uses Interstate 10, Loop 375, U.S. 54, border crossings, industrial areas, distribution corridors, and routes connecting Texas and New Mexico. A local investigation may need to consider border-area logistics, multiple jurisdictions, and out-of-state companies.'] },
    ],
    faqs: [
      { question: 'What is an electronic logging device?', answer: 'An ELD is an electronic system used by many commercial drivers and motor carriers to record driving-time information required by federal hours-of-service rules.' },
      { question: 'Why should truck evidence be preserved quickly?', answer: 'Electronic data, video, and business records may be overwritten or discarded under retention practices. Early investigation can help identify what needs to be preserved.' },
    ],
    sources: [
      { name: 'Federal Motor Carrier Safety Administration — Hours of Service', url: 'https://www.fmcsa.dot.gov/regulations/hours-service' },
      { name: 'TxDOT — Crash reports and records', url: 'https://www.txdot.gov/data-maps/crash-reports-records.html' },
    ],
  },
  {
    id: 'wrongful-death-deadline',
    slug: 'texas-wrongful-death-deadline',
    title: 'Texas Wrongful Death Deadlines: What Families Should Know',
    metaDescription: 'Texas generally applies a two-year limitations period to actions for injury resulting in death, but exceptions and other claims can affect the analysis.',
    summary: 'Texas generally provides a two-year limitations period for an action for injury resulting in death, measured from the death of the injured person.',
    topic: 'Wrongful Death',
    readTime: '6 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Wrongful Death Lawyers', path: '/el-paso-wrongful-death-lawyers' },
    sections: [
      { heading: 'The general two-year rule', paragraphs: ['Texas Civil Practice and Remedies Code Section 16.003(b) generally requires an action for injury resulting in death to be brought no later than two years after the cause of action accrues, and states that the cause accrues on the death of the injured person.', 'That is a general rule, not a substitute for case-specific advice. Different defendants, claims, tolling doctrines, or notice requirements can affect the analysis.'] },
      { heading: 'Wrongful death and survival claims are different', paragraphs: ['A wrongful death claim generally addresses losses suffered by statutorily eligible surviving family members. A survival claim is conceptually different and preserves certain claims the deceased person could have pursued had the person lived. Which claims are available depends on the facts and Texas law.'] },
      { heading: 'Evidence should be preserved long before the deadline', paragraphs: ['Fatal crashes and other catastrophic events often involve evidence that can disappear quickly: video, electronic vehicle data, workplace records, medical records, witness memories, product components, and company communications. Families should not use the statutory deadline as a reason to delay investigation.'] },
    ],
    faqs: [
      { question: 'Is the Texas wrongful death deadline always exactly two years?', answer: 'Two years is the general period stated in Section 16.003(b), but exceptions, tolling, special defendants, and other rules can change the result.' },
      { question: 'Who can bring a Texas wrongful death claim?', answer: 'Texas law identifies the statutory beneficiaries who may bring a wrongful death action. Eligibility depends on the family relationship and circumstances.' },
    ],
    sources: [
      { name: 'Texas Civil Practice & Remedies Code Chapter 16', url: 'https://statutes.capitol.texas.gov/Docs/CP/htm/CP.16.htm' },
      { name: 'Texas Civil Practice & Remedies Code Chapter 71', url: 'https://statutes.capitol.texas.gov/Docs/CP/htm/CP.71.htm' },
    ],
  },
  {
    id: 'texas-dwi-basics',
    slug: 'texas-dwi-basics-el-paso',
    title: 'Texas DWI Basics for El Paso Drivers',
    metaDescription: 'A general overview of Texas DWI law, why DWI cases can involve both criminal and driver-license consequences, and when to seek legal advice.',
    summary: 'Texas DWI law is found primarily in Penal Code Chapter 49. A DWI arrest can raise criminal, bond, evidence, and driver-license issues.',
    topic: 'Criminal Defense',
    readTime: '6 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso DWI Lawyers', path: '/el-paso-dwi-lawyers' },
    sections: [
      { heading: 'Texas DWI is a criminal allegation', paragraphs: ['Texas Penal Code Chapter 49 contains the state’s intoxication offenses, including driving while intoxicated. A DWI case can involve evidence such as officer observations, field sobriety testing, breath or blood testing, video, statements, driving behavior, and the legality of the stop or arrest.', 'The exact charge and possible consequences depend on the facts, prior history, alleged alcohol concentration, injuries, passengers, and other circumstances.'] },
      { heading: 'Criminal court and license issues can be separate', paragraphs: ['A DWI arrest can also create driver-license issues that are handled through administrative procedures separate from the criminal prosecution. Deadlines for requesting review or a hearing can be short, so people facing a DWI arrest should not assume the criminal court date is the only deadline that matters.'] },
      { heading: 'Preserve records early', paragraphs: ['Save release paperwork, bond conditions, tow and impound documents, citations, blood-draw paperwork, videos, receipts, phone records, and any documents from the Department of Public Safety. An attorney can evaluate what additional evidence should be requested or preserved.'] },
    ],
    faqs: [
      { question: 'Where is Texas DWI law found?', answer: 'Texas intoxication offenses are primarily located in Penal Code Chapter 49.' },
      { question: 'Can a DWI arrest affect my driver license before the criminal case ends?', answer: 'Potentially yes. Texas has administrative driver-license procedures that can operate separately from the criminal case, and deadlines may apply.' },
    ],
    sources: [
      { name: 'Texas Penal Code Chapter 49', url: 'https://statutes.capitol.texas.gov/Docs/PE/htm/PE.49.htm' },
      { name: 'Texas Department of Public Safety — Driver License', url: 'https://www.dps.texas.gov/section/driver-license' },
    ],
  },
  {
    id: 'child-custody-basics',
    slug: 'texas-child-custody-conservatorship-basics',
    title: 'Texas Child Custody: Conservatorship, Possession, and Access Basics',
    metaDescription: 'Texas family law uses terms such as conservatorship, possession, and access. Learn the basic vocabulary and why the child’s best interest is central.',
    summary: 'Texas family courts use the terms conservatorship, possession, and access rather than relying only on the everyday phrase “child custody.”',
    topic: 'Family Law',
    readTime: '7 min read',
    updatedAt: '2026-08-09',
    relatedPracticeArea: { label: 'Compare El Paso Child Custody Lawyers', path: '/el-paso-child-custody-lawyers' },
    sections: [
      { heading: 'Texas uses specific legal terms', paragraphs: ['In Texas family cases, conservatorship generally addresses parental rights and duties, while possession and access address parenting time. The details of an order can determine who makes particular decisions, when each parent has possession, geographic restrictions, and other parenting responsibilities.', 'The label used in conversation—“custody”—does not always capture the details that matter in a court order.'] },
      { heading: 'Best interest of the child is central', paragraphs: ['Texas family law makes the best interest of the child a primary consideration in determining conservatorship and possession issues. Courts evaluate the evidence and circumstances of each case rather than applying a single automatic result.', 'Cases can become more complicated when they involve relocation, family violence, substance abuse allegations, military deployment, long-distance parenting, or repeated violations of an existing order.'] },
      { heading: 'Existing orders matter', paragraphs: ['If a court has already entered a custody or possession order, a parent generally should review the exact language before changing schedules or withholding possession. Modification and enforcement have their own legal requirements and procedures.'] },
    ],
    faqs: [
      { question: 'What does conservatorship mean in Texas?', answer: 'Conservatorship concerns the legal rights and duties of parents or other conservators, including decision-making responsibilities described in the court order.' },
      { question: 'Can a Texas custody order be modified?', answer: 'Texas law provides procedures for modification when the statutory requirements are satisfied. The facts and existing order should be reviewed carefully.' },
    ],
    sources: [
      { name: 'Texas Family Code Chapter 153', url: 'https://statutes.capitol.texas.gov/Docs/FA/htm/FA.153.htm' },
    ],
  },  {
    id: 'uber-lyft-accident-el-paso',
    slug: 'what-to-do-after-uber-lyft-accident-el-paso',
    title: 'What to Do After an Uber or Lyft Accident in El Paso, Texas',
    metaDescription:
      'What should you do if your Uber or Lyft crashes in El Paso? Learn what information to save, how rideshare insurance may matter, crash-report basics, and when to consider legal help.',
    summary:
      'A practical El Paso guide for passengers, drivers, pedestrians, cyclists, and other motorists involved in an Uber or Lyft crash.',
    topic: 'Uber & Lyft Accidents',
    readTime: '7 min read',
    updatedAt: '2026-08-16',
    relatedPracticeArea: {
      label: 'Compare El Paso Uber & Lyft Accident Lawyers',
      path: '/el-paso-uber-lyft-accident-lawyers',
    },

    sections: [
      {
        heading: 'Start with safety and medical care',
        paragraphs: [
          'If an Uber or Lyft is involved in a crash in El Paso, address immediate safety first. Call 911 when someone may be injured, traffic conditions are dangerous, or emergency assistance is needed. If you are able to move safely out of active traffic, do so without putting yourself or others at additional risk.',
          'Some injuries are not obvious immediately after a collision. Seek appropriate medical attention and keep copies of medical records, discharge instructions, bills, prescriptions, and follow-up recommendations.',
        ],
      },

      {
        heading: 'Save your Uber or Lyft trip information immediately',
        paragraphs: [
          'Rideshare crashes can involve electronic information that does not exist in an ordinary two-car collision. Save the trip receipt, driver name, vehicle information, pickup and drop-off locations, route information, timestamps, screenshots, support messages, and any notices you receive through the rideshare app.',
          'If you were a passenger, take screenshots before information becomes harder to locate in the app. If you were a rideshare driver, preserve information showing your app and trip status at the time of the collision.',
        ],
        bullets: [
          'Save screenshots of the active or completed trip.',
          'Save the driver name, vehicle, and license-plate information.',
          'Keep pickup, destination, route, and timestamp information.',
          'Preserve messages with Uber, Lyft, the driver, or customer support.',
          'Save photographs and videos from the crash scene.',
        ],
      },

      {
        heading: 'Document the crash like any other serious collision',
        paragraphs: [
          'When it is safe, photograph the vehicles, damage, license plates, roadway, traffic controls, debris, visible injuries, and the surrounding scene. Obtain witness names and contact information when possible.',
          'Also save insurance information for the drivers involved. A rideshare company being involved does not eliminate the importance of ordinary crash evidence such as photographs, witnesses, police information, vehicle damage, medical records, and communications with insurers.',
        ],
      },

      {
        heading: 'Understand why rideshare insurance can be different',
        paragraphs: [
          'Insurance questions can become more complicated in an Uber or Lyft crash because coverage may depend on the driver’s status when the collision occurred. Relevant facts can include whether the driver was offline, logged into the rideshare network, waiting for a ride request, traveling to pick up a passenger, or transporting a passenger.',
          'The Texas Department of Insurance explains that personal automobile policies may not provide the same coverage while a vehicle is being used for ridesharing and that rideshare companies are subject to insurance requirements. The actual policies and facts of the crash should be reviewed rather than assuming a particular policy applies.',
        ],
      },

      {
        heading: 'Get the Texas crash report when one exists',
        paragraphs: [
          'TxDOT is the state custodian of Texas crash reports. For qualifying crashes investigated by law enforcement, the investigating officer submits a Texas Peace Officer’s Crash Report, commonly called a CR-3, to TxDOT.',
          'A crash report can identify drivers, vehicles, insurers, witnesses, roadway information, and recorded observations, but it may not contain every fact needed to evaluate responsibility or insurance coverage. App data, trip records, photographs, video, witnesses, medical records, and other evidence can also be important.',
        ],
      },

      {
        heading: 'Be careful before signing releases or giving detailed statements',
        paragraphs: [
          'A rideshare collision can involve the rideshare driver, another motorist, more than one insurer, and potentially different coverage depending on the driver’s status. Keep copies of every insurance letter, email, claim number, recorded-statement request, medical authorization, settlement offer, and release you receive.',
          'If injuries are significant, fault is disputed, multiple insurers are involved, or coverage is unclear, consider getting legal advice before signing a broad release or accepting a settlement that may resolve claims permanently.',
        ],
      },

      {
        heading: 'What if another driver caused the Uber or Lyft crash?',
        paragraphs: [
          'The fact that you were riding in an Uber or Lyft does not necessarily mean the rideshare driver caused the collision. Another driver may be responsible, or responsibility may be disputed among multiple drivers.',
          'When another motorist caused the crash, that driver’s liability insurance may be relevant, while other potentially applicable coverage may also need to be evaluated based on the circumstances and policy terms.',
        ],
      },

      {
        heading: 'What if the driver who caused the crash was uninsured?',
        paragraphs: [
          'Uninsured or underinsured motorist coverage may become important when the responsible driver has no insurance or insufficient liability limits. Which policy or policies may apply depends on the circumstances, the rideshare driver’s status, and the relevant insurance contracts.',
          'Preserve all coverage documents and insurance communications rather than assuming that no recovery is available simply because one driver lacked sufficient insurance.',
        ],
      },

      {
        heading: 'When an El Paso rideshare accident lawyer may help',
        paragraphs: [
          'Consider speaking with an attorney when the crash caused serious injuries, hospitalization, lost income, permanent impairment, disputed fault, a death, or significant insurance complications.',
          'An attorney reviewing an Uber or Lyft crash may examine police records, trip and app information, insurance policies, photographs, video, medical evidence, witness statements, vehicle information, and communications with the companies and insurers involved.',
        ],
      },
    ],

    faqs: [
      {
        question: 'What should I do if my Uber crashes in El Paso?',
        answer:
          'Address immediate safety and medical needs, report the crash when appropriate, photograph the scene, save witness information, preserve your Uber trip receipt and screenshots, and keep medical and insurance records.',
      },
      {
        question: 'What should I save from the Uber or Lyft app after a crash?',
        answer:
          'Save the trip receipt, driver information, vehicle details, pickup and destination information, timestamps, route information, screenshots, support messages, and any crash-related notices.',
      },
      {
        question: 'Does Uber or Lyft insurance automatically cover every rideshare crash?',
        answer:
          'Do not assume a particular policy automatically applies. Coverage can depend on the driver’s app and trip status, the parties involved, available personal and rideshare policies, and the facts of the collision.',
      },
      {
        question: 'What if another driver caused the rideshare crash?',
        answer:
          'The other driver’s liability insurance may be relevant. Depending on the circumstances, additional coverage may also need to be evaluated.',
      },
      {
        question: 'Can I get a Texas crash report after an Uber or Lyft accident?',
        answer:
          'When law enforcement investigates a qualifying Texas crash, a CR-3 peace officer crash report may be available to eligible requesters through the TxDOT crash-records system.',
      },
      {
        question: 'When should I contact an Uber or Lyft accident lawyer in El Paso?',
        answer:
          'Consider legal advice promptly when injuries are serious, responsibility is disputed, multiple insurers are involved, the rideshare driver’s status is unclear, or electronic trip evidence may need to be preserved.',
      },
    ],

    sources: [
      {
        name: 'Texas Department of Insurance — Ride sharing: 3 questions to ask',
        url: 'https://www.tdi.texas.gov/tips/ride-sharing.html',
      },
      {
        name: 'Texas Occupations Code Chapter 2402 — Transportation Network Companies',
        url: 'https://statutes.capitol.texas.gov/Docs/OC/htm/OC.2402.htm',
      },
      {
        name: 'Texas Department of Transportation — Crash reports and records',
        url: 'https://www.txdot.gov/data-maps/crash-reports-records.html',
      },
    ],
  },
];

export const getArticleBySlug = (slug: string | undefined) =>
  articles.find((article) => article.slug === slug);
