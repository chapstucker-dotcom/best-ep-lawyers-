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
  {
    id: 'what-to-do-after-arrest-el-paso',
    slug: 'what-to-do-after-arrest-el-paso',
    title: 'What to Do After an Arrest in El Paso, Texas',
    metaDescription: 'Learn what generally happens after an arrest in El Paso, including magistrate warnings, bond and release issues, court dates, evidence preservation, and when to contact a criminal defense lawyer.',
    summary: 'A practical guide to the first steps after an arrest in El Paso, including the magistrate process, bond and release conditions, court paperwork, evidence preservation, and getting legal help.',
    topic: 'Criminal Defense',
    readTime: '8 min read',
    updatedAt: '2026-09-10',
    relatedPracticeArea: { label: 'Compare El Paso Criminal Defense Lawyers', path: '/el-paso-criminal-defense-lawyers' },
    sections: [
      {
        heading: 'Focus first on safety, identification, and the immediate process',
        paragraphs: [
          'After an arrest, avoid physical resistance and follow lawful safety instructions. The first hours can involve transportation, booking, identification, property inventory, medical screening, and a determination of where the person will be held or released.',
          'Do not rely on another personâ€™s experience to predict exactly what will happen. The process can differ based on the alleged offense, warrants, the arresting agency, whether the case is state or federal, and other circumstances.',
        ],
      },
      {
        heading: 'Texas law requires a prompt appearance before a magistrate',
        paragraphs: [
          'Texas Code of Criminal Procedure Article 15.17 generally requires the person having custody of someone who has been arrested to take the arrested person before a magistrate without unnecessary delay and no later than 48 hours after the arrest.',
          'At that appearance, the magistrate must provide required warnings and information. The statute addresses the accusation, the right to retain counsel, the right to remain silent, the right to have an attorney present during questioning, the right to terminate an interview, and the right to request appointed counsel if the person cannot afford an attorney.',
        ],
      },
      {
        heading: 'Be careful about statements and questioning',
        paragraphs: [
          'Anything a person says after an arrest can become important later. Article 15.17 requires the magistrate to advise an arrested person of the right to remain silent and the right to have an attorney present during an interview with law enforcement or attorneys representing the state.',
          'A person who wants legal advice before answering investigative questions can ask to speak with an attorney. Whether a particular statement may be used in court depends on the facts and applicable law, so specific questions about an interview, confession, recording, or waiver should be reviewed individually.',
        ],
      },
      {
        heading: 'Understand bond and release conditions before leaving custody',
        paragraphs: [
          'Bail is the security used to help ensure that an accused person appears before the proper court. Texas bail law is detailed and has changed in recent years, so the type of release, amount of bail, eligibility, and conditions can depend on the charge, criminal history, other pending cases, court authority, and additional statutory factors.',
          'Before leaving custody, keep copies of any bond paperwork and release conditions. Conditions can address matters such as court appearances, contact with particular people, travel, alcohol or controlled substances, electronic monitoring, or other restrictions depending on the case. Violating a release condition can create additional legal problems.',
        ],
      },
      {
        heading: 'Save every document and identify the next court date',
        paragraphs: [
          'Keep booking or release papers, bond documents, magistrate paperwork, charging documents, citations, property receipts, court notices, and any written conditions of release. Write down the arresting agency, approximate time and location of the arrest, and any case, booking, or cause number shown on official paperwork.',
          'Do not assume that a future notice will correct a missed date. If the paperwork is unclear about where or when to appear, confirm the information with the appropriate court or with counsel rather than relying on memory or informal advice.',
        ],
        bullets: [
          'Keep the original paperwork together and make a backup copy.',
          'Record every scheduled court date and reporting requirement.',
          'Save contact information for witnesses who may have seen relevant events.',
          'Preserve texts, photos, videos, receipts, location records, and other potentially relevant digital evidence.',
        ],
      },
      {
        heading: 'Preserve evidence instead of trying to improve or explain it',
        paragraphs: [
          'Evidence can disappear quickly. Surveillance video may be overwritten, messages can be deleted, and witnesses can become difficult to locate. Preserve potentially relevant information in its original form when possible.',
          'Avoid editing screenshots, deleting unfavorable messages, contacting witnesses to influence what they say, or posting detailed accounts of the incident on social media. A lawyer can evaluate what evidence may matter and whether preservation requests or other steps are appropriate.',
        ],
      },
      {
        heading: 'El Paso arrests may involve different courts and agencies',
        paragraphs: [
          'The court and detention process depends on the type of case. El Paso County operates a Jail Magistrate function, and the Downtown Detention Facility houses Jail Magistrate Courts along with bonding, warrants, and other detention-related operations.',
          'Some matters can involve municipal, county, district, or federal authorities. El Pasoâ€™s border location also means that certain arrests may involve federal agencies or immigration consequences. The agency that made the arrest does not by itself answer every question about which court will ultimately handle the case.',
        ],
      },
      {
        heading: 'When to contact an El Paso criminal defense lawyer',
        paragraphs: [
          'Consider seeking legal advice promptly after an arrest, when questioning is requested, when a person is trying to understand bond or release conditions, when a court date is approaching, or when important evidence may need to be preserved.',
          'A criminal defense lawyer can review the alleged offense, charging and bond documents, police reports when available, statements, searches, video, witness information, prior history, and the procedural posture of the case. The appropriate strategy depends on the specific facts rather than on a general checklist.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How soon must someone arrested in Texas see a magistrate?',
        answer: 'Texas Code of Criminal Procedure Article 15.17 generally requires an arrested person to be taken before a magistrate without unnecessary delay and no later than 48 hours after the arrest.',
      },
      {
        question: 'Do I have to answer police questions after an arrest?',
        answer: 'Article 15.17 requires warnings that include the right to remain silent, the right to have an attorney present during an interview with law enforcement or attorneys representing the state, and the right to terminate the interview. Questions about a specific statement or interview should be evaluated based on the facts.',
      },
      {
        question: 'What paperwork should I keep after being released from jail?',
        answer: 'Keep bond and release papers, magistrate paperwork, charging documents, court notices, property receipts, and anything showing a case, booking, or cause number. Also keep a written record of upcoming court dates and release conditions.',
      },
      {
        question: 'Can bond conditions continue after I leave jail?',
        answer: 'Yes. Release can be subject to conditions imposed under applicable law and court orders. Read the written conditions carefully and get legal advice if any requirement is unclear.',
      },
      {
        question: 'What evidence should I preserve after an arrest?',
        answer: 'Preserve relevant messages, photographs, videos, receipts, location records, witness contact information, official paperwork, and other records connected to the incident. Avoid altering or deleting potentially relevant material.',
      },
      {
        question: 'When should I contact a criminal defense lawyer in El Paso?',
        answer: 'Consider contacting counsel promptly after an arrest, before investigative questioning, when bond or release conditions are unclear, when a court date is approaching, or when evidence may need to be preserved.',
      },
    ],
    sources: [
      {
        name: 'Texas Code of Criminal Procedure Chapter 15 â€” Arrest Under Warrant and Article 15.17',
        url: 'https://statutes.capitol.texas.gov/Docs/CR/pdf/CR.15.pdf',
      },
      {
        name: 'Texas Code of Criminal Procedure Chapter 17 â€” Bail',
        url: 'https://statutes.capitol.texas.gov/Docs/CR/pdf/CR.17.pdf',
      },
      {
        name: 'El Paso County â€” Jail Magistrate',
        url: 'https://www.epcounty.com/615/Jail-Magistrate',
      },
      {
        name: 'El Paso County â€” Downtown Detention Facility',
        url: 'https://www.epcounty.com/1147/Downtown-Detention-Facility',
      },
    ],
  },
  {
    id: 'texas-dwi-license-suspension-alr-hearing-el-paso',
    slug: 'texas-dwi-license-suspension-alr-hearing-el-paso',
    title: 'Texas DWI License Suspension & ALR Hearings: El Paso Guide',
    metaDescription: 'Learn how Texas DWI-related license suspensions and ALR hearings generally work, including notice deadlines, failed or refused tests, delayed blood results, and when to seek legal help.',
    summary: 'A practical guide to Texas Administrative License Revocation after a DWI arrest, including hearing deadlines, DIC-25 notices, delayed blood-test results, what an ALR hearing decides, and how the process differs from the criminal case.',
    topic: 'Criminal Defense',
    readTime: '8 min read',
    updatedAt: '2026-09-10',
    relatedPracticeArea: { label: 'Compare El Paso DWI Lawyers', path: '/el-paso-dwi-lawyers' },
    sections: [
      {
        heading: 'An ALR case is separate from the criminal DWI case',
        paragraphs: [
          'Texas uses the Administrative License Revocation process for certain driver-license suspensions connected to DWI or BWI arrests. The Texas Department of Public Safety describes ALR as a civil administrative process that is separate from the criminal prosecution.',
          'That means a person can have a criminal court case and a driver-license proceeding moving on different tracks. A criminal court date does not replace an ALR deadline, and an ALR result does not by itself decide the criminal charge.',
        ],
      },
      {
        heading: 'Read the suspension notice immediately',
        paragraphs: [
          'For many refusal or failed-test cases, the arresting officer issues a DIC-25 notice. DPS describes the DIC-25 as the suspension notice that explains the steps for requesting an ALR hearing.',
          'Do not assume the deadline runs from the next court date. The deadline depends on the type of notice and how the driver received it, so the actual paperwork should be reviewed promptly.',
        ],
      },
      {
        heading: 'Many ALR hearing requests have a 15-day deadline',
        paragraphs: [
          'DPS states that when a driver is served an ALR suspension or disqualification notice, the driver generally has 15 days from the date the notice is served to request a hearing.',
          'If a timely hearing is not requested in that circumstance, DPS states that the suspension generally takes effect on the 40th day after service of the notice. Because missing the request deadline can eliminate the opportunity for an ALR hearing, a driver should not wait for the criminal case to develop before checking the notice.',
        ],
      },
      {
        heading: 'Delayed blood-test results can create a different notice timeline',
        paragraphs: [
          'When a driver consents to a blood test and the result is not available at the time of arrest, DPS explains that a suspension notice may be mailed later if the reported alcohol concentration is above the applicable limit.',
          'DPS currently states that in this delayed blood-result situation the driver has 20 days from the date the suspension notice is mailed to request a hearing. This is one reason a general statement such as "every driver has 15 days after arrest" can be inaccurate.',
        ],
      },
      {
        heading: 'A timely hearing request can delay the suspension decision',
        paragraphs: [
          'Texas law provides procedures for contesting an ALR suspension before an administrative law judge. ALR hearings are conducted through the State Office of Administrative Hearings.',
          'A timely request generally keeps the proposed suspension from becoming final until the administrative process reaches a decision. The hearing notice should be reviewed carefully for the date, time, location or remote-hearing information, and any instructions for submitting evidence or appearing.',
        ],
      },
      {
        heading: 'What the ALR hearing addresses',
        paragraphs: [
          'An ALR hearing does not function as a full criminal DWI trial. It addresses the statutory issues that allow DPS to suspend or disqualify driving privileges under the applicable Transportation Code provisions.',
          'The exact issues depend on whether the case involves a refusal, a failed breath or blood test, a commercial license, a minor, or another category. Police reports, sworn paperwork, test records, video, and testimony can become important depending on the case.',
        ],
      },
      {
        heading: 'Preserve the paperwork and evidence tied to the arrest',
        paragraphs: [
          'Keep the DIC-25 or mailed suspension notice, temporary driving permit if issued, bond and release papers, citations, blood-draw paperwork, breath-test documents, tow or impound records, and any DPS correspondence.',
          'Also preserve potentially relevant video, photographs, receipts, phone location records, witness information, and other records connected to the stop or arrest. Do not alter or delete potentially relevant material.',
        ],
        bullets: [
          'Write down the date the notice was served or mailed.',
          'Save the envelope if DPS mailed the notice.',
          'Keep proof of any hearing request that is submitted.',
          'Record the ALR hearing date separately from criminal court dates.',
          'Check the current status of the Texas driver license through official DPS resources.',
        ],
      },
      {
        heading: 'Occupational licenses and reinstatement are separate questions',
        paragraphs: [
          'DPS states that some people whose non-commercial driving privileges are suspended may be eligible to apply for an occupational license. Eligibility and the procedure depend on the type of suspension and the person\'s circumstances, so an occupational license should not be treated as automatic.',
          'DPS also states that an ALR reinstatement fee is required before renewal or issuance of a license after an ALR suspension, in addition to any other outstanding requirements. Drivers should confirm current eligibility and compliance items directly with DPS.',
        ],
      },
      {
        heading: 'When to contact an El Paso DWI lawyer',
        paragraphs: [
          'Consider seeking legal advice promptly if the hearing-request deadline is approaching, the notice is unclear, a blood result arrived after the arrest, the case involves a refusal, a commercial license, a prior alcohol-related enforcement action, or the driver needs to understand how the ALR process interacts with the criminal case.',
          'A DWI lawyer can review the notice, arrest paperwork, testing evidence, available video, prior history, and applicable deadlines. The available options depend on the facts and current law rather than on a single general rule.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is an ALR hearing the same as my DWI criminal case?',
        answer: 'No. Texas DPS describes Administrative License Revocation as a civil administrative process separate from the criminal DWI or BWI prosecution.',
      },
      {
        question: 'How long do I have to request an ALR hearing in Texas?',
        answer: 'DPS states that many ALR hearing requests must be made within 15 days after the driver is served the suspension notice. A different timeline can apply when DPS later mails a suspension notice after receiving a consenting blood-test result, so the actual notice should be reviewed immediately.',
      },
      {
        question: 'What is a DIC-25?',
        answer: 'Texas DPS describes the DIC-25 as a suspension notice issued in certain failed-test or refusal cases that explains how to request an ALR hearing.',
      },
      {
        question: 'What happens if my blood-test result was not available when I was arrested?',
        answer: 'DPS states that when a driver consented to a blood test and an over-limit result is received later, DPS may mail a Notice of Suspension. DPS currently describes a 20-day period from the mailing date to request a hearing in that situation.',
      },
      {
        question: 'Does requesting an ALR hearing stop the criminal DWI case?',
        answer: 'No. The ALR process and the criminal prosecution are separate proceedings. A hearing request concerns the administrative driver-license action, not whether the criminal charge continues.',
      },
      {
        question: 'Can I get an occupational license after an ALR suspension?',
        answer: 'Some drivers may be eligible to apply for an occupational license to operate a non-commercial motor vehicle while suspended. Eligibility is not automatic and depends on the applicable law and the driver\'s circumstances.',
      },
      {
        question: 'When should I contact a DWI lawyer in El Paso about an ALR notice?',
        answer: 'Consider contacting counsel promptly because hearing-request deadlines can be short and may depend on how and when the notice was issued or mailed.',
      },
    ],
    sources: [
      {
        name: 'Texas Department of Public Safety â€” Administrative License Revocation (ALR) Program',
        url: 'https://www.dps.texas.gov/section/driver-license/administrative-license-revocation-alr-program',
      },
      {
        name: 'Texas Department of Public Safety â€” ALR Frequently Asked Questions',
        url: 'https://www.dps.texas.gov/section/driver-license/faq/section-19-administrative-license-revocation-alr',
      },
      {
        name: 'Texas Transportation Code Chapter 524 â€” Administrative Suspension of Driver\'s License for Failure to Pass Test',
        url: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.524.htm',
      },
      {
        name: 'Texas Transportation Code Chapter 724 â€” Implied Consent',
        url: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.724.htm',
      },
      {
        name: 'Texas Department of Public Safety â€” ALR Hearing Request',
        url: 'https://www.dps.texas.gov/apps/DriverLicense/DLHearings/ALR',
      },
    ],
  },
  {
    id: "how-to-file-for-divorce-texas-el-paso",
    slug: "how-to-file-for-divorce-texas-el-paso",
    title: "How to File for Divorce in Texas: Step-by-Step El Paso Guide",
    metaDescription:
      "Learn the general Texas divorce process from residency and filing through service, temporary orders, settlement, and the final decree, with El Paso-specific considerations.",
    summary:
      "A practical overview of how a Texas divorce generally moves from the initial petition to a final decree, including residency, service, temporary orders, property, children, settlement, and court.",
    topic: "Family Law",
    readTime: "9 min read",
    updatedAt: "2026-09-10",
    relatedPracticeArea: {
      label: "Compare El Paso Divorce Lawyers",
      path: "/el-paso-divorce-lawyers",
    },
    sections: [
      {
        heading: "Confirm that Texas and El Paso County are proper places to file",
        paragraphs: [
          "Texas Family Code Section 6.301 generally requires that, when the divorce is filed, either spouse has been a Texas domiciliary for the preceding six months and a resident of the county where the case is filed for the preceding 90 days.",
          "Texas law also contains special residency rules for certain military and public-service situations. Those provisions can matter for families connected to Fort Bliss or for spouses who have recently been stationed, deployed, or transferred.",
        ],
      },
      {
        heading: "Start the case with an Original Petition for Divorce",
        paragraphs: [
          "A Texas divorce case generally begins when one spouse files an Original Petition for Divorce. The filing spouse is the petitioner, and the other spouse is the respondent.",
          "The petition identifies the marriage and asks the court for the relief the petitioner seeks. Depending on the case, the requested relief may involve property and debts, children, support, temporary orders, name restoration, or other issues.",
        ],
      },
      {
        heading: "Make sure the other spouse receives legally sufficient notice",
        paragraphs: [
          "After filing, the respondent generally must receive legally sufficient notice of the case unless an authorized waiver or another permitted procedure applies. TexasLawHelp explains that a respondent may be formally served or may voluntarily file an answer or a waiver of service.",
          "A waiver should be read carefully before it is signed. Service and waiver requirements can become especially important when there is family violence, a protective order, disagreement about jurisdiction, or concern that a spouse may not participate voluntarily.",
        ],
      },
      {
        heading: "Understand the response and whether the case is agreed or contested",
        paragraphs: [
          "A respondent who is served has a deadline to file an answer. Filing an answer allows the respondent to participate and prevents the case from being completed by default without the procedures required for a contested case.",
          "A divorce may be agreed if the spouses can resolve all issues needed for the final decree. It is contested when material issues remain disputed and the court may need to resolve them through hearings or trial.",
        ],
      },
      {
        heading: "Temporary orders may control important issues while the case is pending",
        paragraphs: [
          "A divorce can take months or longer, especially when issues are disputed. Temporary orders may address children, possession schedules, support, use of the home or vehicles, payment of bills, preservation of property, and other matters while the case is pending.",
          "Temporary decisions can have practical consequences well before the final decree, so parties should keep court papers and understand exactly what any temporary order requires.",
        ],
      },
      {
        heading: "Identify property, debts, retirement benefits, and financial information",
        paragraphs: [
          "Texas divorce cases can require the spouses to identify and characterize property and debts. Issues may include community property, separate-property claims, real estate, bank accounts, retirement benefits, businesses, vehicles, credit accounts, reimbursement claims, and other financial interests.",
          "Retirement benefits may require additional plan-specific documents. TexasLawHelp notes that dividing some retirement accounts can require a Qualified Domestic Relations Order or other additional paperwork.",
        ],
      },
      {
        heading: "Address conservatorship, possession, and support when children are involved",
        paragraphs: [
          "When spouses have children, the divorce may also determine conservatorship, parental rights and duties, possession and access, child support, medical support, geographic restrictions, and related parenting provisions.",
          "Texas uses the terms conservatorship, possession, and access rather than relying only on the everyday word custody. The final decree should state the parenting and support terms precisely because those provisions can remain important long after the marriage is dissolved.",
        ],
      },
      {
        heading: "The 60-day rule is a minimum waiting period, not a completion promise",
        paragraphs: [
          "Texas Family Code Section 6.702 generally prevents a court from granting a divorce before the 60th day after the suit is filed, subject to statutory exceptions.",
          "That does not mean a Texas divorce will be finished in 60 days. Service, temporary orders, financial investigation, discovery, negotiations, mediation, children-related issues, court scheduling, and trial preparation can extend the timeline.",
        ],
      },
      {
        heading: "Settlement or mediation may resolve the case before trial",
        paragraphs: [
          "Many divorces are resolved through agreement or mediation rather than a contested trial. Any agreement should be translated accurately into the final decree and related orders.",
          "Complex assets, retirement plans, businesses, military benefits, real estate, cross-border property, parenting restrictions, or support obligations can make careful drafting particularly important.",
        ],
      },
      {
        heading: "Finish the divorce with a final decree and any required supporting orders",
        paragraphs: [
          "A divorce is not finished merely because the spouses separate or reach an agreement. The court must sign a Final Decree of Divorce that resolves the issues necessary to complete the case.",
          "Depending on the circumstances, additional documents may be needed for child support, possession, retirement division, property transfers, or other matters. After the judge signs the decree, keep a complete copy and follow any additional steps required to carry out its terms.",
        ],
      },
      {
        heading: "When to contact an El Paso divorce lawyer",
        paragraphs: [
          "Consider legal advice early when the divorce involves disputed children, family violence, significant property or debt, retirement benefits, a business, military service, another state or country, hidden assets, temporary-order disputes, or uncertainty about where the case should be filed.",
          "A lawyer can also review proposed settlement terms and the final decree before signing, when mistakes or incomplete language could affect property, support, parenting rights, or future enforcement.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long must I live in Texas before filing for divorce?",
        answer:
          "Texas Family Code Section 6.301 generally requires that either spouse has been a Texas domiciliary for the preceding six months and a resident of the filing county for the preceding 90 days. Special rules may apply in some military or public-service situations.",
      },
      {
        question: "Do I have to wait 60 days to get divorced in Texas?",
        answer:
          "Texas law generally prevents a court from granting the divorce before the 60th day after filing, subject to statutory exceptions. The 60 days are a minimum waiting period and do not guarantee that the case will finish on that date.",
      },
      {
        question: "What starts a Texas divorce case?",
        answer:
          "The case generally begins when one spouse files an Original Petition for Divorce with the appropriate court.",
      },
      {
        question: "Does my spouse have to be served?",
        answer:
          "The respondent generally must receive legally sufficient notice. Formal service may be used, although a respondent may be able to file an answer or an authorized waiver of service instead.",
      },
      {
        question: "What is the difference between an agreed and contested divorce?",
        answer:
          "An agreed divorce means the spouses can resolve the issues needed for the final decree. A contested divorce involves one or more unresolved issues that may require additional negotiation, hearings, mediation, or trial.",
      },
      {
        question: "Can a Texas court make temporary orders during a divorce?",
        answer:
          "Yes. Temporary orders can address issues such as children, possession schedules, support, property use, bills, and preservation of assets while the divorce is pending.",
      },
      {
        question: "What happens to retirement accounts in a divorce?",
        answer:
          "Retirement benefits may have community and separate-property components. Some plans require additional documents, such as a Qualified Domestic Relations Order when applicable, to carry out a division ordered in the divorce.",
      },
      {
        question: "When should I contact an El Paso divorce lawyer?",
        answer:
          "Consider contacting counsel before filing or signing major documents when the case involves children, significant property or debt, retirement benefits, military service, family violence, jurisdiction questions, cross-border issues, or contested terms.",
      },
    ],
    sources: [
      {
        name: "Texas Family Code Chapter 6 - Suit for Dissolution of Marriage",
        url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm",
      },
      {
        name: "TexasLawHelp - I Need a Divorce. We Have Children Under 18",
        url: "https://texaslawhelp.org/guide/i-need-a-divorce-we-have-children-under-18",
      },
      {
        name: "TexasLawHelp - I Need a Divorce. We Do Not Have Minor Children",
        url: "https://texaslawhelp.org/guide/i-need-a-divorce-we-do-not-have-minor-children",
      },
      {
        name: "TexasLawHelp - My Spouse Filed for Divorce",
        url: "https://texaslawhelp.org/guide/my-spouse-filed-for-divorce",
      },
    ],
  },
];

export const getArticleBySlug = (slug: string | undefined) =>
  articles.find((article) => article.slug === slug);
