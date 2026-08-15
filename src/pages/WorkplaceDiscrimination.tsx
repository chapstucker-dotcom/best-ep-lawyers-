import { useEffect } from "react";
import LeadCaptureForm from "../components/LeadCaptureForm";

const topics = [
  "Age Discrimination","Sex Discrimination","Pregnancy Discrimination",
  "Race Discrimination","National Origin Discrimination","Disability Discrimination",
  "Religious Discrimination","Workplace Retaliation","Discriminatory Termination",
  "Hiring & Promotion Discrimination","Pay Discrimination","Hostile Work Environment"
];

const faqs = [
  ["What is workplace discrimination?","Workplace discrimination generally involves an employment decision or treatment connected to a characteristic protected by applicable law. The requirements depend on the claim, employer, facts, and governing law."],
  ["What types of employment discrimination can a lawyer evaluate?","Employment attorneys may evaluate allegations involving race, color, religion, sex, pregnancy, national origin, age, disability, and other legally protected characteristics, as well as related retaliation claims."],
  ["What evidence should I preserve?","Preserve relevant emails, texts, performance reviews, disciplinary records, complaints, schedules, pay records, policies, promotion records, termination documents, witness information, and a timeline of important events."],
  ["Can age discrimination be unlawful?","Federal and state employment laws can prohibit certain age-based employment discrimination. Whether a particular decision is unlawful depends on coverage, the facts, evidence, and applicable deadlines."],
  ["Can sex or pregnancy discrimination be unlawful?","Employment decisions based on sex or pregnancy can raise legal issues under applicable anti-discrimination laws. Related disputes can also involve harassment, accommodations, leave, pay, promotion, or retaliation."],
  ["Can disability discrimination involve accommodations?","Disability-related employment matters can involve hiring, termination, workplace treatment, and requests for reasonable accommodation. Applicable duties and defenses depend on the circumstances and governing law."],
  ["Can retaliation follow a discrimination complaint?","Retaliation can raise separate legal issues when adverse treatment follows certain protected complaints, reports, requests, or participation in a protected process. Timing and documentation can be important."],
  ["Do discrimination claims have deadlines?","Yes. Employment discrimination matters can involve administrative filing periods, statutes of limitation, contractual deadlines, and other time limits, so prompt review can be important."]
];

export default function WorkplaceDiscrimination() {
  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Best Workplace Discrimination Lawyers in El Paso, TX | Compare Attorneys";
    const existing = document.querySelector('meta[name="description"]');
    const old = existing?.getAttribute("content") ?? null;
    const meta = existing ?? document.head.appendChild(document.createElement("meta"));
    meta.setAttribute("name","description");
    meta.setAttribute("content","Compare workplace discrimination lawyers in El Paso, TX for age, sex, pregnancy, race, national origin, disability discrimination, retaliation, and other employment claims.");
    return () => {
      document.title = oldTitle;
      if (existing && old !== null) existing.setAttribute("content",old);
      else if (!existing) meta.remove();
    };
  }, []);

  const box = { background:"#111827", border:"1px solid #1e293b", borderRadius:"14px", padding:"20px" };

  return (
    <main style={{minHeight:"100vh",background:"#0f172a",color:"white",padding:"60px 24px",fontFamily:"Arial, sans-serif"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto"}}>
        <p style={{color:"#fbbf24",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em"}}>El Paso Employment Law Directory</p>
        <h1 style={{color:"#fbbf24",fontSize:"56px",lineHeight:1.1,margin:"14px 0 24px"}}>Best Workplace Discrimination Lawyers in El Paso, TX</h1>
        <p style={{color:"#cbd5e1",fontSize:"21px",lineHeight:1.75,maxWidth:"930px"}}>
          Compare El Paso workplace discrimination lawyers and employment attorneys handling age discrimination, sex and pregnancy discrimination, race and national-origin discrimination, disability discrimination, workplace retaliation, and related employment claims.
        </p>

        <section style={{marginTop:"52px"}}>
          <h2 style={{fontSize:"32px"}}>Workplace Discrimination Matters</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
            {topics.map(t => <div key={t} style={box}>{t}</div>)}
          </div>
        </section>

        <section style={{marginTop:"52px",...box,padding:"30px"}}>
          <h2 style={{fontSize:"30px",marginTop:0}}>Employment Discrimination in El Paso</h2>
          <p style={{color:"#cbd5e1",lineHeight:1.75}}>
            Workplace discrimination disputes in El Paso can arise in healthcare, logistics, transportation, construction, manufacturing, retail, hospitality, professional services, education, government contracting, and other workplaces throughout El Paso County.
          </p>
          <p style={{color:"#cbd5e1",lineHeight:1.75}}>
            A dispute may involve hiring, firing, promotion, demotion, compensation, scheduling, job assignments, discipline, leave, accommodations, harassment, or other employment decisions. The analysis depends on the protected characteristic or activity involved, the employer's explanation, available evidence, and applicable law.
          </p>
          <p style={{color:"#cbd5e1",lineHeight:1.75}}>
            Emails, text messages, personnel records, pay records, policies, performance reviews, complaints, disciplinary documents, and the timing of workplace decisions can be important. Employment matters can also involve administrative procedures and filing deadlines.
          </p>
        </section>

        <section style={{marginTop:"52px"}}>
          <h2 style={{fontSize:"32px"}}>Related Employment Law Topics</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px"}}>
            {[
              ["Employment Law","/el-paso-employment-lawyers"],
              ["Wrongful Termination","/el-paso-wrongful-termination-lawyers"],
              ["Workplace Retaliation","/el-paso-retaliation-lawyers"],
              ["Sexual Harassment","/el-paso-sexual-harassment-lawyers"],
              ["Wage & Hour","/el-paso-wage-hour-lawyers"],
              ["Employment Contracts","/el-paso-employment-contract-lawyers"],
              ["Severance Agreements","/el-paso-severance-agreement-lawyers"]
            ].map(([label,path]) => (
              <a key={path} href={path} style={{...box,color:"#fff",textDecoration:"none",fontWeight:700}}>
                {label}<span style={{display:"block",color:"#fbbf24",fontSize:"14px",marginTop:"8px"}}>Compare El Paso attorneys →</span>
              </a>
            ))}
          </div>
        </section>

        <section style={{marginTop:"52px"}}>
          <h2 style={{fontSize:"32px"}}>Frequently Asked Questions</h2>
          <div style={{display:"grid",gap:"16px"}}>
            {faqs.map(([q,a]) => <div key={q} style={box}><h3 style={{marginTop:0}}>{q}</h3><p style={{color:"#cbd5e1",lineHeight:1.7,marginBottom:0}}>{a}</p></div>)}
          </div>
        </section>

        <section style={{marginTop:"52px",...box,padding:"28px"}}>
          <h2 style={{marginTop:0}}>Connect With an El Paso Workplace Discrimination Lawyer</h2>
          <p style={{color:"#cbd5e1",lineHeight:1.7}}>Use the form below to submit your information and connect with a participating law firm.</p>
          <LeadCaptureForm />
        </section>

        <a href="/el-paso-employment-lawyers" style={{display:"inline-block",marginTop:"36px",background:"#fbbf24",color:"#0f172a",padding:"16px 24px",borderRadius:"12px",textDecoration:"none",fontWeight:"bold"}}>← Employment Law</a>
      </div>
    </main>
  );
}
