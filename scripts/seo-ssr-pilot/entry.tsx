import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../../src/App.tsx";
import MetaPixelTracker from "../../src/components/MetaPixelTracker";

export function renderPersonalInjury(): string {
  const html = renderToString(
    <StaticRouter location="/el-paso-personal-injury-lawyers/">
      <MetaPixelTracker />
      <App />
    </StaticRouter>
  );

  const h1Count = (html.match(/<h1\b/g) ?? []).length;

  if (h1Count !== 1) {
    throw new Error(`Expected one H1, found ${h1Count}`);
  }

  return html;
}

console.log(
  `Personal Injury SSR: ${renderPersonalInjury().length} HTML characters`
);

export function renderMotorcycle(): string {
  const html = renderToString(
    <StaticRouter location="/el-paso-motorcycle-accident-lawyers/">
      <MetaPixelTracker />
      <App />
    </StaticRouter>
  );

  const h1Count = (html.match(/<h1\b/g) ?? []).length;

  if (h1Count !== 1) {
    throw new Error(`Expected one Motorcycle H1, found ${h1Count}`);
  }

  return html;
}

function renderAdditionalPage(path: string, name: string): string {
  const html = renderToString(
    <StaticRouter location={path}>
      <MetaPixelTracker />
      <App />
    </StaticRouter>
  );

  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  if (h1Count !== 1) {
    throw new Error(`Expected one ${name} H1, found ${h1Count}`);
  }

  return html;
}

export function renderCarAccident(): string {
  return renderAdditionalPage("/el-paso-car-accident-lawyers/", "Car Accident");
}

export function renderTruckAccident(): string {
  return renderAdditionalPage("/el-paso-truck-accident-lawyers/", "Truck Accident");
}

export function renderProtectiveOrder(): string { return renderAdditionalPage('/el-paso-protective-order-lawyers/', 'Protective Order'); }

export function renderFamilyViolence(): string {
  return renderAdditionalPage("/el-paso-family-violence-lawyers/", "Family Violence");
}

export function renderLandlordTenant(): string {
  return renderAdditionalPage("/el-paso-landlord-tenant-lawyers/", "Landlord Tenant");
}

export function renderPrenuptialAgreement(): string {
  return renderAdditionalPage("/el-paso-prenuptial-agreement-lawyers/", "Prenuptial Agreement");
}

export function renderSexDiscrimination(): string {
  return renderAdditionalPage("/el-paso-sex-discrimination-lawyers/", "Sex Discrimination");
}

export function renderSideswipeAccident(): string {
  return renderAdditionalPage("/el-paso-sideswipe-accident-lawyers/", "Sideswipe Accident");
}

export function renderTBoneAccident(): string {
  return renderAdditionalPage("/el-paso-t-bone-accident-lawyers/", "T-Bone Accident");
}

export function renderUninsuredMotorist(): string {
  return renderAdditionalPage("/el-paso-uninsured-motorist-lawyers/", "Uninsured Motorist");
}

export function renderWrongWayAccident(): string {
  return renderAdditionalPage("/el-paso-wrong-way-accident-lawyers/", "Wrong-Way Accident");
}

export function renderWageHour(): string {
  return renderAdditionalPage('/el-paso-wage-hour-lawyers/', 'Wage & Hour');
}

export function renderSexualHarassment(): string {
  return renderAdditionalPage('/el-paso-sexual-harassment-lawyers/', 'Sexual Harassment');
}

export function renderCriminalDefense(): string { return renderAdditionalPage('/el-paso-criminal-defense-lawyers/', 'Criminal Defense'); }
export function renderImmigration(): string { return renderAdditionalPage('/el-paso-immigration-lawyers/', 'Immigration'); }
export function renderFamilyLaw(): string { return renderAdditionalPage('/el-paso-family-lawyers/', 'Family Law'); }
export function renderEmploymentLaw(): string { return renderAdditionalPage('/el-paso-employment-lawyers/', 'Employment Law'); }
export function renderWrongfulTermination(): string { return renderAdditionalPage('/el-paso-wrongful-termination-lawyers/', 'Wrongful Termination'); }
export function renderWrongfulDeath(): string { return renderAdditionalPage('/el-paso-wrongful-death-lawyers/', 'Wrongful Death'); }
export function renderMedicalMalpractice(): string { return renderAdditionalPage('/el-paso-medical-malpractice-lawyers/', 'Medical Malpractice'); }
export function renderSlipAndFall(): string { return renderAdditionalPage('/el-paso-slip-and-fall-lawyers/', 'Slip and Fall'); }
export function renderEstatePlanning(): string { return renderAdditionalPage('/el-paso-estate-planning-lawyers/', 'Estate Planning'); }
export function renderRetaliation(): string { return renderAdditionalPage('/el-paso-retaliation-lawyers/', 'Retaliation'); }

export function renderDWI(): string { return renderAdditionalPage('/el-paso-dwi-lawyers/', 'DWI'); }
export function renderUninsuredDriverGuide(): string { return renderAdditionalPage('/guides/uninsured-driver-accident-texas', 'Uninsured Driver Guide'); }

export function renderTrafficTicket(): string { return renderAdditionalPage('/el-paso-traffic-ticket-lawyers/', 'Traffic Ticket'); }
export function renderWorkersCompensation(): string { return renderAdditionalPage('/el-paso-workers-compensation-lawyers/', 'Workers Compensation'); }
