import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

try {
  for (const slug of ["el-paso-personal-injury-lawyers", "el-paso-motorcycle-accident-lawyers", "el-paso-car-accident-lawyers", "el-paso-truck-accident-lawyers", "el-paso-family-violence-lawyers", "el-paso-landlord-tenant-lawyers", "el-paso-prenuptial-agreement-lawyers", "el-paso-sex-discrimination-lawyers", "el-paso-sideswipe-accident-lawyers", "el-paso-t-bone-accident-lawyers", "el-paso-uninsured-motorist-lawyers", "el-paso-wrong-way-accident-lawyers", "el-paso-wage-hour-lawyers", "el-paso-sexual-harassment-lawyers", "el-paso-protective-order-lawyers", "el-paso-criminal-defense-lawyers", "el-paso-immigration-lawyers", "el-paso-family-lawyers", "el-paso-employment-lawyers", "el-paso-wrongful-termination-lawyers", "el-paso-wrongful-death-lawyers", "el-paso-medical-malpractice-lawyers", "el-paso-slip-and-fall-lawyers", "el-paso-estate-planning-lawyers", "el-paso-retaliation-lawyers", "el-paso-dwi-lawyers", "guides/uninsured-driver-accident-texas"]) {
    const page = await browser.newPage();
    const errors = [];

    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(`http://127.0.0.1:4173/${slug}/`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    const result = await page.evaluate(() => ({
      ssr: document.getElementById("root")?.dataset.ssr,
      h1: document.querySelectorAll("h1").length,
      heading: document.querySelector("h1")?.textContent?.trim(),
    }));

    console.log(JSON.stringify({
      page: slug,
      status: response?.status(),
      ...result,
      errors,
    }, null, 2));

    const expectedMarker = slug.startsWith("guides/") ? "uninsured-driver-guide" : slug.replace(/^el-paso-/, "").replace(/-lawyers$/, "").replace(/^motorcycle-accident$/, "motorcycle");
    if (response?.status() !== 200 || result.ssr !== expectedMarker || result.h1 !== 1 || !result.heading || errors.some(error => /hydration|hydrating|server rendered html|server-rendered html|text content does not match|react error #(?:418|423|425)/i.test(error))) {
      throw new Error(`${slug}: hydration validation failed: ${JSON.stringify({ status: response?.status(), ...result, errors })}`);
    }

    await page.close();
  }
} finally {
  await browser.close();
}
