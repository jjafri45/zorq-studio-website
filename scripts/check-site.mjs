import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const requiredRoutes = [
  "index.html",
  "services/index.html",
  "automations/index.html",
  "case-studies/index.html",
  "case-studies/pulsegrid-tech/index.html",
  "about-us/index.html",
  "faq/index.html",
  "contact/index.html",
  "lets-talk/index.html",
  "blogs/index.html",
  "privacy-policy/index.html",
  "terms-and-conditions/index.html",
  "404.html",
  "sitemap.xml",
  "robots.txt"
];

const requiredAssets = [
  "assets/styles.css",
  "assets/main.js",
  "assets/brand/zorq-logo-green.png",
  "assets/brand/favicon.png",
  "assets/fonts/Orbitron-VariableFont_wght.ttf",
  "assets/fonts/Rajdhani-SemiBold.ttf",
  "assets/images/hero-operator.webp"
];

async function assertFile(relPath) {
  const filePath = path.join(dist, relPath);
  const stat = await fs.stat(filePath);
  if (!stat.isFile() || stat.size === 0) throw new Error(`Missing or empty file: ${relPath}`);
}

for (const relPath of [...requiredRoutes, ...requiredAssets]) {
  await assertFile(relPath);
}

const home = await fs.readFile(path.join(dist, "index.html"), "utf8");
const checks = [
  "We craft intelligent visual universes.",
  "AI-powered branding",
  "Start a Project",
  "Selected work",
  "Copyright 2026 ZORQ Studio"
];

for (const text of checks) {
  if (!home.includes(text)) throw new Error(`Home page missing expected text: ${text}`);
}

const css = await fs.readFile(path.join(dist, "assets", "styles.css"), "utf8");
if (css.includes("TODO") || home.includes("TODO")) {
  throw new Error("Build contains TODO placeholder text.");
}

console.log("Static site smoke checks passed.");
