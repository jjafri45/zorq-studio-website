import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { blogPosts, caseStudies, site } from "../src/content.mjs";
import {
  aboutPage,
  automationsPage,
  blogPostPage,
  blogsPage,
  caseStudyPage,
  contactPage,
  faqPage,
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
const lastmod = "2026-05-13";

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

function routeMeta(route) {
  if (route === "/") return { changefreq: "weekly", priority: "1.0" };
  if (route === "/blogs/") return { changefreq: "weekly", priority: "0.8" };
  if (route.startsWith("/case-studies/") && route !== "/case-studies/") return { changefreq: "monthly", priority: "0.7" };
  if (route === "/case-studies/" || route === "/services/" || route === "/about-us/" || route === "/faq/" || route === "/automations/") return { changefreq: "monthly", priority: "0.8" };
  if (route === "/contact/" || route === "/lets-talk/") return { changefreq: "monthly", priority: "0.7" };
  if (route === "/privacy-policy/" || route === "/terms-and-conditions/") return { changefreq: "yearly", priority: "0.3" };
  if (blogPosts.some((post) => `/${post.slug}/` === route)) return { changefreq: "weekly", priority: "0.6" };
  return { changefreq: "monthly", priority: "0.7" };
}

function sitemap(routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((route) => route !== "/404.html")
  .map((route) => {
    const meta = routeMeta(route);
    return `  <url>
    <loc>${site.origin}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;
}

const routeMap = new Map([
  ["/", homePage()],
  ["/services/", servicesPage()],
  ["/automations/", automationsPage()],
  ["/case-studies/", workPage()],
  ["/about-us/", aboutPage()],
  ["/faq/", faqPage()],
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

await fs.writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /404.html\nSitemap: ${site.origin}/sitemap.xml\n`, "utf8");
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap([...routeMap.keys()]), "utf8");

console.log(`Generated ${written.length} pages in ${path.relative(root, dist)}`);
