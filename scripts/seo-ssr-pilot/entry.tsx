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
