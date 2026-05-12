import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blogPosts, caseStudies, site } from "../src/content.mjs";
import {
  aboutPage,
  blogPostPage,
  blogsPage,
  caseStudyPage,
  contactPage,
  homePage,
  legalPage,
  notFoundPage,
  servicesPage,
  workPage
} from "../src/templates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await fs.copyFile(src, dest);
    }
  }
}

async function writeRoute(route, html) {
  const outputPath =
    route === "/404.html"
      ? path.join(dist, "404.html")
      : path.join(dist, route.replace(/^\/|\/$/g, ""), "index.html");
  const finalPath = route === "/" ? path.join(dist, "index.html") : outputPath;
  await fs.mkdir(path.dirname(finalPath), { recursive: true });
  await fs.writeFile(finalPath, html, "utf8");
  return finalPath;
}

function sitemap(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((route) => route !== "/404.html")
  .map(
    (route) => `  <url>
    <loc>${site.origin}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

const routeMap = new Map([
  ["/", homePage()],
  ["/services/", servicesPage()],
  ["/case-studies/", workPage()],
  ["/about-us/", aboutPage()],
  ["/contact/", contactPage("/contact/")],
  ["/lets-talk/", contactPage("/lets-talk/")],
  ["/blogs/", blogsPage()],
  ["/privacy-policy/", legalPage("privacy")],
  ["/terms-and-conditions/", legalPage("terms")],
  ["/404.html", notFoundPage()]
]);

for (const item of caseStudies) {
  routeMap.set(`/case-studies/${item.slug}/`, caseStudyPage(item));
}

for (const post of blogPosts) {
  routeMap.set(`/${post.slug}/`, blogPostPage(post));
}

await fs.rm(dist, { recursive: true, force: true });
await copyDir(publicDir, dist);
await fs.copyFile(path.join(root, "src", "styles.css"), path.join(dist, "assets", "styles.css"));
await fs.copyFile(path.join(root, "src", "main.js"), path.join(dist, "assets", "main.js"));

const written = [];
for (const [route, html] of routeMap) {
  written.push(await writeRoute(route, html));
}

await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`, "utf8");
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap([...routeMap.keys()]), "utf8");

console.log(`Generated ${written.length} pages in ${path.relative(root, dist)}`);
