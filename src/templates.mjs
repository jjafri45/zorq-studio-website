import { blogPosts, caseStudies, caseStudyNarratives, faqEntries, process, services, site, testimonials } from "./content.mjs";

const year = "2026";
const basePath = (globalThis.process?.env?.BASE_PATH || "").replace(/\/$/, "");
const assetVersion = globalThis.process?.env?.ASSET_VERSION || "dev";

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function prefixRootUrls(html) {
  if (!basePath) return html;
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${basePath}/`);
}

function activeClass(current, href) {
  if (href === "/" && current === "home") return "is-active";
  if (href.includes("services") && current === "services") return "is-active";
  if (href.includes("case-studies") && current === "work") return "is-active";
  if (href.includes("faq") && current === "faq") return "is-active";
  if (href.includes("about-us") && current === "studio") return "is-active";
  if (href.includes("contact") && current === "contact") return "is-active";
  return "";
}

function iconArrow() {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function iconMail() {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4zm0 0 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function iconWhatsApp() {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 0 1 6.9 12.1L20 20l-4-1a8 8 0 1 1-4-15Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.6 9.3c.2-.4.5-.4.8-.4.2 0 .4 0 .6.5.1.4.5 1.4.5 1.5.1.2.1.4 0 .6-.1.1-.2.3-.4.4-.2.1-.3.2-.1.5.2.3.8 1.2 1.8 1.9 1.2.8 2 .9 2.3 1 .3 0 .5 0 .7-.2.2-.3.8-.9 1-.9.2 0 .4.1.6.2l1.4.7c.2.1.4.2.4.4 0 .3-.3 1.6-1.1 2.2-.6.4-1.4.6-2 .5-.6 0-1.4-.2-2.4-.7-1.7-.8-3.3-2.4-4.2-4-.9-1.6-1.1-2.9-.8-3.8.2-.8.8-1.3.9-1.4Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function contactActionGroup({ includeProject = true, includeWhatsapp = true, includeEmail = false, compact = false } = {}) {
  const items = [];
  if (includeProject) items.push(`<a class="button primary" href="/contact/">Start a Project ${iconArrow()}</a>`);
  if (includeWhatsapp) items.push(`<a class="button ghost contact-whatsapp" href="${site.whatsappHref}" target="_blank" rel="noreferrer">WhatsApp ${iconWhatsApp()}</a>`);
  if (includeEmail) items.push(`<a class="button ghost contact-email" href="mailto:${site.email}">Email ${iconMail()}</a>`);
  return `<div class="contact-action-group${compact ? " compact" : ""}">${items.join("")}</div>`;
}

function flattenText(value) {
  if (Array.isArray(value)) return value.flatMap(flattenText);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenText);
  return value ? [String(value)] : [];
}

function sectionIntro(title, copy, align = "") {
  return `<div class="section-intro ${align}">
    <h2>${esc(title)}</h2>
    ${copy ? `<p>${esc(copy)}</p>` : ""}
  </div>`;
}

function statsStrip() {
  const stats = [
    ["12", "+", "Trusted Clients"],
    ["45", "+", "Projects Delivered"],
    ["3", "x", "Faster Delivery"],
    ["100", "%", "Satisfaction"]
  ];

  return `<div class="stats-strip" data-stats>
    ${stats
      .map(
        ([value, suffix, label]) => `<div class="stat-item">
          <strong data-count="${value}" data-suffix="${suffix}">0${suffix}</strong>
          <span>${esc(label)}</span>
        </div>`
      )
      .join("")}
  </div>`;
}

function metricGrid(metrics = []) {
  return `<div class="metrics-grid" data-reveal-stagger>
    ${metrics
      .map(
        ([value, label]) => `<article class="metric-card">
          <strong>${esc(value)}</strong>
          <span>${esc(label)}</span>
        </article>`
      )
      .join("")}
  </div>`;
}

function readingTime(post) {
  const words = flattenText([post.title, post.excerpt, post.intro, post.keyTakeaways, post.sections, post.faqs])
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(4, Math.ceil(words / 200));
}

function header(current) {
  const links = site.nav
    .map(
      (item) =>
        `<a class="${activeClass(current, item.href)}" href="${item.href}">${esc(item.label)}</a>`
    )
    .join("");

  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="nav-shell">
      <a class="brand" href="/" aria-label="ZORQ Studio home">
        <img src="/assets/brand/zorq-logo-green.png" alt="ZORQ Studio" width="156" height="34" />
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">${links}</nav>
      <div class="nav-actions">
        <a class="nav-cta" href="/contact/">Start a Project ${iconArrow()}</a>
        <a class="nav-cta nav-cta-secondary" href="${site.whatsappHref}" target="_blank" rel="noreferrer">WhatsApp ${iconWhatsApp()}</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
          <span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" data-mobile-menu>
      <nav aria-label="Mobile navigation">${links}</nav>
      ${contactActionGroup({ includeProject: true, includeWhatsapp: true, includeEmail: true, compact: true })}
    </div>
  </header>`;
}

function footer() {
  const nav = site.nav.map((item) => `<a href="${item.href}">${esc(item.label)}</a>`).join("");
  const social = site.social
    .map((item) => `<a href="${item.href}" target="_blank" rel="noreferrer">${esc(item.label)}</a>`)
    .join("");

  return `<footer class="site-footer">
    <div class="footer-top">
      <div>
        <img src="/assets/brand/zorq-logo-green.png" alt="ZORQ Studio" width="180" height="39" />
        <p>Creating the Unseen. Defining the Future.</p>
      </div>
      ${contactActionGroup({ includeProject: true, includeWhatsapp: true, includeEmail: true })}
    </div>
    <div class="footer-grid">
      <div>
        <h2>Visual universes for intelligent brands.</h2>
        <p>ZORQ Studio fuses strategy, design, content, automation, and front-end craft into one future-ready creative system.</p>
      </div>
      <div>
        <h3>Pages</h3>
        <nav>${nav}<a href="/blogs/">Blogs</a></nav>
      </div>
      <div>
        <h3>Follow</h3>
        <nav>${social}</nav>
      </div>
      <div class="footer-contact">
        <h3>Contact</h3>
        <p>Talk to ZORQ directly for strategy, design, automation, and launch systems.</p>
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="/contact/">Open the project brief</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Copyright ${year} ZORQ Studio. All rights reserved.</span>
      <span><a href="/faq/">FAQ</a> / <a href="/privacy-policy/">Privacy Policy</a> / <a href="/terms-and-conditions/">Terms</a></span>
    </div>
  </footer>`;
}

function layout({
  title,
  description,
  current,
  body,
  path = "/",
  image = "/assets/images/deep-space.webp",
  metaType = "website",
  extraHead = "",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
}) {
  const canonical = `${site.origin}${path === "/" ? "/" : path}`;
  return prefixRootUrls(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${esc(robots)}" />
  <meta name="author" content="ZORQ Studio" />
  <link rel="canonical" href="${canonical}" />
  <meta name="theme-color" content="#0a0a0a" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="${esc(metaType)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${site.origin}${image}" />
  <meta property="og:site_name" content="ZORQ Studio" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@zorqstudio" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${site.origin}${image}" />
  <link rel="icon" type="image/png" href="/assets/brand/favicon.png?v=${assetVersion}" />
  <link rel="preload" href="/assets/fonts/Orbitron-VariableFont_wght.ttf?v=${assetVersion}" as="font" type="font/ttf" crossorigin />
  <link rel="preload" href="/assets/fonts/Rajdhani-SemiBold.ttf?v=${assetVersion}" as="font" type="font/ttf" crossorigin />
  <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}" />
  ${extraHead}
</head>
<body data-page="${esc(current)}">
  <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
  <div class="custom-cursor" data-cursor aria-hidden="true"></div>
  ${header(current)}
  <main id="main">${body}</main>
  ${footer()}
  <button class="scroll-top" type="button" aria-label="Scroll to top" data-scroll-top>${iconArrow()}</button>
  <script type="module" src="/assets/main.js?v=${assetVersion}"></script>
</body>
</html>`);
}

function heroVisual() {
  return `<div class="hero-visual" aria-label="ZORQ cosmic AI visual system">
    <img class="hero-portrait" src="/assets/images/hero-operator.webp" alt="Green futuristic creative operator for ZORQ Studio" width="1000" height="667" fetchpriority="high" />
    <div class="orbit-field" aria-hidden="true">
      <img src="/assets/brand/zorq-q-green.png" alt="" />
      <svg viewBox="0 0 420 420">
        <circle cx="210" cy="210" r="188"></circle>
        <circle cx="210" cy="210" r="132"></circle>
        <path d="M42 217c78-64 177-90 297-78M78 310c75 20 164 19 267-3M100 89c90 48 166 102 228 162"></path>
      </svg>
    </div>
  </div>`;
}

function ctaBlock(title = "Ready to build a brand system that moves?", copy = "Bring the ambition. ZORQ will architect the visual universe, digital experience, and intelligent systems around it.") {
  return `<section class="cta-band section" data-reveal>
    <div class="container cta-grid">
      <h2>${esc(title)}</h2>
      <div>
        <p>${esc(copy)}</p>
        ${contactActionGroup({ includeProject: true, includeWhatsapp: true, includeEmail: true })}
      </div>
    </div>
  </section>`;
}

function serviceList(limit = services.length) {
  return `<div class="service-list" data-reveal-stagger>
    ${services
      .slice(0, limit)
      .map(
        (service) => `<article class="service-row" data-reveal>
          <span>${service.number}</span>
          <div>
            <h3>${esc(service.title)}</h3>
            <p>${esc(service.summary)}</p>
          </div>
          <ul>${service.tags.slice(0, 4).map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>
        </article>`
      )
      .join("")}
  </div>`;
}

function workGrid(items = caseStudies) {
  return `<div class="work-grid" data-reveal-stagger>
    ${items
      .map(
        (item, index) => `<a class="work-card ${index === 0 ? "featured" : ""}" href="/case-studies/${item.slug}/" data-reveal>
          <figure>
            <img src="${item.image}" alt="${esc(item.alt)}" width="1400" height="900" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ""} />
          </figure>
          <div class="work-card-body">
            <span>${esc(item.category)}</span>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.summary)}</p>
            <strong>${esc(item.impact)}</strong>
          </div>
        </a>`
      )
      .join("")}
  </div>`;
}

function processSection() {
  return `<section class="section process-section" data-reveal>
    <div class="container">
      ${sectionIntro("Process built like an orbit.", "A clear loop from insight to launch, then back into optimization.")}
      <div class="process-grid" data-reveal-stagger>
        ${process
          .map(
            (step, index) => `<article>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.text)}</p>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

function homeProcessSection() {
  const outerRotation = (-12 * Math.PI) / 180;
  const orbitPath =
    "M 465.188 204.267 A 220 100 -12 1 1 34.812 295.733 A 220 100 -12 1 1 465.188 204.267";
  const nodes = process.map((step, index) => {
    const angle = (index * 60 * Math.PI) / 180;
    const x = 250 + 220 * Math.cos(angle) * Math.cos(outerRotation) - 100 * Math.sin(angle) * Math.sin(outerRotation);
    const y = 250 + 220 * Math.cos(angle) * Math.sin(outerRotation) + 100 * Math.sin(angle) * Math.cos(outerRotation);
    const num = String(index + 1).padStart(2, "0");
    return `<g class="process-node${index === 0 ? " is-active" : ""}" data-process-node data-step-index="${index}" role="button" tabindex="0" aria-label="Step ${num}: ${esc(step.title)}" aria-pressed="${index === 0 ? "true" : "false"}">
      <text class="process-node-num" x="${x.toFixed(3)}" y="${(y - 28).toFixed(3)}" text-anchor="middle">${num}</text>
      <circle class="process-node-ring" cx="${x.toFixed(3)}" cy="${y.toFixed(3)}" r="22"></circle>
      <circle class="process-node-dot" cx="${x.toFixed(3)}" cy="${y.toFixed(3)}" r="${index === 0 ? "11" : "8"}"></circle>
      <text class="process-node-label" x="${x.toFixed(3)}" y="${(y + 34).toFixed(3)}" text-anchor="middle">${esc(step.title)}</text>
    </g>`;
  });

  return `<section class="section process-section process-section-home" data-reveal>
    <div class="container">
      ${sectionIntro("Process built like an orbit.", "A clear loop from insight to launch, then back into optimization.")}
      <div class="process-orbit-layout" data-orbit-process>
        <div class="process-orbit-visual" aria-hidden="true">
          <svg class="process-orbit-svg" viewBox="0 0 500 500" aria-hidden="true" focusable="false">
            <defs>
              <filter id="orbitGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
              </filter>
              <filter id="travelGlow">
                <feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="blur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
            </defs>
            <g class="orbit-rings">
              <ellipse cx="250" cy="250" rx="220" ry="100" transform="rotate(-12 250 250)"></ellipse>
              <ellipse cx="250" cy="250" rx="155" ry="70" transform="rotate(8 250 250)"></ellipse>
              <ellipse cx="250" cy="250" rx="85" ry="38"></ellipse>
              <g class="orbit-traveller orbit-traveller-halo" data-orbit-traveller-halo>
                <circle r="10" fill="rgba(0,200,83,0.15)"></circle>
                <animateMotion dur="12s" repeatCount="indefinite" calcMode="linear" path="${orbitPath}"></animateMotion>
              </g>
              <g class="orbit-traveller" data-orbit-traveller filter="url(#travelGlow)">
                <circle r="5" fill="#00c853"></circle>
                <animateMotion data-orbit-motion dur="12s" repeatCount="indefinite" calcMode="linear" path="${orbitPath}"></animateMotion>
              </g>
            </g>
            <g class="orbit-center">
              <circle cx="250" cy="250" r="28"></circle>
              <text x="250" y="255" text-anchor="middle">Z</text>
            </g>
            <g class="orbit-nodes">
              ${nodes.join("")}
            </g>
          </svg>
        </div>
        <div class="process-orbit-panel">
          <div class="process-detail-card" data-process-detail>
            <span class="process-detail-num">01</span>
            <h3 class="process-detail-title">Discover</h3>
            <p class="process-detail-copy">Map the brand, audience, market signals, and operational constraints before design begins.</p>
          </div>
        </div>
        <div class="process-mobile-list" data-reveal-stagger>
          ${process
            .map(
              (step, index) => `<article class="process-mobile-item">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${esc(step.title)}</h3>
                <p>${esc(step.text)}</p>
              </article>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function testimonialsSection(useCardClass = false) {
  return `<section class="section testimonial-section" data-reveal>
    <div class="container">
      ${sectionIntro("Client signal.", "What matters is not decoration. It is the velocity, clarity, and confidence the work creates.")}
      <div class="testimonial-marquee" data-testimonial-marquee>
      <div class="testimonial-grid testimonial-track">
        ${testimonials
          .map(
            (item) => `<figure${useCardClass ? ' class="testimonial-card"' : ""}>
              <blockquote>${esc(item.quote)}</blockquote>
              <figcaption>${esc(item.name)} <span>${esc(item.company)}</span></figcaption>
            </figure>`
          )
          .join("")}
      </div>
      </div>
    </div>
  </section>`;
}

export function homePage() {
  const body = `<section class="hero section">
    <canvas class="cosmic-canvas" aria-hidden="true" data-cosmic></canvas>
    <div class="container hero-grid">
      <div class="hero-copy">
        <h1>We craft intelligent visual universes.</h1>
        <p>AI-powered branding, interfaces, content systems, and automation for brands built to feel inevitable.</p>
        ${statsStrip()}
        <div class="button-row">
          <a class="button primary" href="/contact/">Start a Project ${iconArrow()}</a>
          <a class="button ghost" href="/case-studies/">View Work ${iconArrow()}</a>
        </div>
      </div>
      ${heroVisual()}
    </div>
    <div class="hero-footer container">
      <span>Creating the Unseen. Defining the Future.</span>
      <a href="#positioning">Scroll</a>
    </div>
  </section>

  <section id="positioning" class="section positioning">
    <div class="container split">
      <h2>From identity to interface, every detail is engineered to move.</h2>
      <div>
        <p>ZORQ Studio is an AI-powered creative studio for brands that want the future to feel calm, precise, and unmistakably theirs.</p>
        <p>We design brand systems, digital products, content engines, and automation loops that keep improving after launch.</p>
      </div>
    </div>
  </section>

  <section class="section services-preview">
    <div class="container">
      ${sectionIntro("Systems, not services.", "Every offer connects strategy, craft, and automation into one coherent creative ecosystem.")}
      ${serviceList(6)}
      <div class="section-action"><a class="text-link" href="/services/">Explore all services ${iconArrow()}</a></div>
    </div>
  </section>

  <section class="section work-section">
    <div class="container">
      ${sectionIntro("Selected work with measurable gravity.", "Case studies shaped as intelligent systems, not one-off deliverables.")}
      ${workGrid(caseStudies.slice(0, 4))}
      <div class="section-action"><a class="text-link" href="/case-studies/">View all case studies ${iconArrow()}</a></div>
    </div>
  </section>

  ${homeProcessSection()}

  <section class="section why-section" data-reveal>
    <div class="container why-grid">
      <div>
        <h2>Design intelligence for brands that refuse average.</h2>
        <p>We pair taste with systems thinking, so the result is not just beautiful. It is clear, scalable, fast, and built to learn.</p>
      </div>
      <div class="why-stack">
        <article class="why-point"><div class="why-point-head"><svg class="why-icon" viewBox="0 0 28 28" aria-hidden="true"><circle cx="6" cy="8" r="2.5"></circle><circle cx="20" cy="6" r="2.5"></circle><circle cx="22" cy="20" r="2.5"></circle><path d="M8.5 8L17.5 6.5M20.8 8.2L21.5 17.5M8 9.8L19.8 18.2"></path></svg><div><span>01</span><h3>AI-enhanced creative systems</h3></div></div><p>Generate, evaluate, and scale more ideas without losing a single brand rule.</p></article>
        <article class="why-point"><div class="why-point-head"><svg class="why-icon" viewBox="0 0 28 28" aria-hidden="true"><path d="M14 3L25 14L14 25L3 14Z"></path><path d="M14 9.6L18.4 14L14 18.4L9.6 14Z"></path></svg><div><span>02</span><h3>Brand clarity</h3></div></div><p>Sharper positioning, stronger visual consistency, and fewer decisions that drift.</p></article>
        <article class="why-point"><div class="why-point-head"><svg class="why-icon" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="11"></circle><path d="M10 17L18 9M12 9H18V15"></path></svg><div><span>03</span><h3>Conversion-focused execution</h3></div></div><p>Creative systems designed around action, measurement, and post-launch momentum.</p></article>
      </div>
    </div>
  </section>

  ${testimonialsSection(true)}
  ${ctaBlock()}`;

  return layout({
    title: "ZORQ Studio - AI-Powered Creative & Branding Studio",
    description:
      "ZORQ Studio builds intelligent brand systems - AI automation, UI/UX design, branding, and content engines for brands built to feel inevitable.",
    current: "home",
    path: "/",
    body,
    extraHead: `<link rel="alternate" hreflang="en" href="${site.origin}/" />
  <link rel="preload" as="image" href="/assets/images/hero-operator.webp?v=${assetVersion}" fetchpriority="high" />
  <link rel="preload" as="image" href="/assets/brand/zorq-logo-green.png?v=${assetVersion}" />`
  });
}

export function servicesPage() {
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Services that turn creative ambition into intelligent systems.</h1>
      <p>Branding, UI/UX, content, automation, and web experiences built to launch fast and keep learning.</p>
    </div>
  </section>
  <section class="section service-detail-section">
    <div class="container" data-reveal-stagger>
      ${services
        .map(
          (service) => `<article class="service-detail" data-reveal>
            <div class="service-detail-head">
              <span>${service.number}</span>
              <h2>${esc(service.title)}</h2>
            </div>
            <p>${esc(service.detail)}</p>
            <ul>${service.tags.map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>
          </article>`
        )
        .join("")}
    </div>
  </section>
  <section class="section service-links-band" data-reveal>
    <div class="container service-links-list">
      <a class="service-link-cta" href="/case-studies/stellarpress-publishing/">See how we built publishing automation for StellarPress Publishing ${iconArrow()}</a>
      <a class="service-link-cta" href="/case-studies/pulsegrid-tech/">See how we redesigned product clarity for PulseGrid Tech ${iconArrow()}</a>
      <a class="service-link-cta" href="${site.whatsappHref}" target="_blank" rel="noreferrer">Ask about your system on WhatsApp ${iconWhatsApp()}</a>
    </div>
  </section>
  ${processSection()}
  ${ctaBlock("Let's architect your creative operating system.", "Tell us what you are building and where the bottleneck lives. We will turn it into a clear system, not a messy wish list.")}`;

  return layout({
    title: "Services - AI Branding, Design & Automation | ZORQ Studio",
    description:
      "From AI content engines to brand identity and web experiences. ZORQ Studio delivers creative systems that launch fast and keep learning.",
    current: "services",
    path: "/services/",
    body
  });
}

export function workPage() {
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Case studies from the edge of intelligent creativity.</h1>
      <p>Work that connects brand systems, interfaces, content, and AI automation to measurable outcomes.</p>
    </div>
  </section>
  <section class="section work-index">
    <div class="container">${workGrid(caseStudies)}</div>
  </section>
  ${ctaBlock("Build the next case study with us.", "If the goal is clarity, speed, and a digital presence that feels alive, ZORQ is ready.")}`;

  return layout({
    title: "Case Studies - AI Creative Work with Measurable Results | ZORQ Studio",
    description:
      "See how ZORQ Studio delivered 5.4x ROAS, 38% sales lifts, and $180K week-one revenue through intelligent brand and automation systems.",
    current: "work",
    path: "/case-studies/",
    body
  });
}

export function caseStudyPage(item) {
  const index = caseStudies.findIndex((study) => study.slug === item.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const narrative = caseStudyNarratives[item.slug];
  const body = `<article class="case-page">
    <section class="case-hero section">
      <div class="container case-hero-grid" data-reveal>
        <div>
          <a class="text-link back-link" href="/case-studies/">${iconArrow()} All Work</a>
          <span class="case-tag">${esc(item.category)}</span>
          <h1>${esc(item.title)}</h1>
          <p>${esc(narrative.descriptor)}</p>
          <strong class="case-key-metric">${esc(narrative.metric)}</strong>
        </div>
        <figure>
          <img src="${item.image}" alt="${esc(item.alt)}" width="1400" height="900" fetchpriority="high" />
        </figure>
      </div>
    </section>
    <section class="section case-narrative case-overview">
      <div class="container case-two-col">
        <aside><span>Overview</span></aside>
        <div class="case-copy" data-reveal-stagger>
          ${narrative.overview.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
        </div>
      </div>
    </section>
    <section class="section case-narrative">
      <div class="container case-two-col">
        <aside><span>The Challenge</span></aside>
        <div class="case-copy" data-reveal>
          <p>${esc(narrative.challengeNarrative)}</p>
          <p><strong>${esc(narrative.problemStatement)}</strong></p>
        </div>
      </div>
    </section>
    <section class="section case-approach">
      <div class="container">
        ${sectionIntro("Our approach.", "A methodical creative system shaped around the exact operational friction.")}
        <div class="phase-list" data-reveal-stagger>
          ${narrative.phases
            .map(
              (phase) => `<article>
                <h2>${esc(phase.title)}</h2>
                <p>${esc(phase.text)}</p>
              </article>`
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section case-results">
      <div class="container">
        ${sectionIntro("Results.", "The numbers mattered because they changed the way the business could move.")}
        ${metricGrid(narrative.metrics)}
        <p class="results-narrative" data-reveal>${esc(narrative.resultsNarrative)}</p>
      </div>
    </section>
    <section class="section case-quote-section">
      <div class="container">
        <figure class="case-quote" data-reveal>
          <blockquote>${esc(narrative.quote)}</blockquote>
          <figcaption>${esc(narrative.quoteName)} <span>${esc(narrative.quoteRole)}</span></figcaption>
        </figure>
      </div>
    </section>
    <section class="section next-case-section">
      <div class="container">
        <a class="next-case-card" href="/case-studies/${next.slug}/" data-reveal>
          <span>Next Case Study</span>
          <h2>${esc(next.title)}</h2>
          <p>${esc(next.headline)}</p>
          <strong>${esc(next.impact)} ${iconArrow()}</strong>
        </a>
      </div>
    </section>
  </article>
  ${ctaBlock("Want a result this sharp?", "Start with the problem. We will design the system that makes the solution repeatable.")}`;

  return layout({
    title: `${item.title} | ZORQ Studio Case Study`,
    description: `${item.headline}. ${item.summary}`,
    current: "work",
    path: `/case-studies/${item.slug}/`,
    image: item.image,
    body
  });
}

export function aboutPage() {
  const body = `<section class="page-hero section about-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>About ZORQ Studio</h1>
      <p>ZORQ Studio engineers intelligent systems that design, write, optimize, and scale brands without turning them generic.</p>
    </div>
  </section>
  <section class="section studio-section">
    <div class="container studio-grid">
      <figure data-reveal>
        <img src="/assets/images/cyberbot-orbit.webp" alt="Cybernetic figure moving through a cosmic interface." width="1400" height="700" loading="lazy" decoding="async" />
      </figure>
      <div data-reveal>
        <h2>We are built for brands that want tomorrow to arrive cleanly.</h2>
        <p>Our work lives at the intersection of visual strategy, digital product craft, content systems, and AI automation. The output is beautiful, but the real value is the operating logic beneath it.</p>
        <ul class="studio-list">
          <li><span>Brand Systems</span><strong>Identity, voice, and visual rules</strong></li>
          <li><span>AI-Driven Projects</span><strong>Creative loops that keep improving</strong></li>
          <li><span>Future-Ready Agency</span><strong>Strategy, design, build, and scale</strong></li>
        </ul>
      </div>
    </div>
  </section>
  ${processSection()}
  <section class="section principles" data-reveal>
    <div class="container">
      ${sectionIntro("Operating principles.", "Minimal enough to be clear. Cosmic enough to be memorable. Intelligent enough to compound.")}
      <div class="principle-grid">
        <article><h3>Taste before output</h3><p>AI can produce volume. Direction turns that volume into work people remember.</p></article>
        <article><h3>Systems before spectacle</h3><p>Every visual decision needs a role, a rule, and a reason to survive beyond launch.</p></article>
        <article><h3>Speed with standards</h3><p>Faster iteration only matters when the final experience still feels premium.</p></article>
      </div>
    </div>
  </section>
  ${testimonialsSection()}
  ${ctaBlock()}`;

  return layout({
    title: "About ZORQ Studio - AI-Powered Creative Intelligence",
    description:
      "ZORQ Studio is a future-ready creative studio fusing AI automation, brand design, and content systems into one coherent operating model.",
    current: "studio",
    path: "/about-us/",
    body
  });
}

export function contactPage(path = "/contact/") {
  const isLetsTalk = path === "/lets-talk/";
  const body = `<section class="page-hero section contact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>${isLetsTalk ? "Let's Talk About Your Next System" : "Start a Project with ZORQ Studio"}</h1>
      <p>${isLetsTalk ? "Book a focused strategy conversation and we will map the brand, growth, and automation gaps worth solving first." : "Start with a brand, product, launch, or messy creative system. We will translate it into a focused next move."}</p>
    </div>
  </section>
  <section class="section contact-section">
    <div class="container contact-grid">
      <div class="contact-copy" data-reveal>
        <h2>Start a project.</h2>
        <p>Use the form for brand systems, websites, AI automation, content engines, campaigns, or case-study-worthy experiments.</p>
        <div class="contact-lines">
          <a href="${site.whatsappHref}" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="mailto:${site.email}">${site.email}</a>
          <a href="/case-studies/">View recent work</a>
          <a href="https://www.instagram.com/zorqstudio/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/zorQstudio/" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
      <form class="project-form" data-contact-form data-email-target="${site.leadEmail}" data-email-subject="zorqstudio website form" data-reveal>
        <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="honeypot-field" aria-hidden="true" />
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" autocomplete="name" required />
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
        </div>
        <div class="form-row">
          <label for="interest">Interest</label>
          <select id="interest" name="interest" required>
            <option value="">Choose one</option>
            <option>Branding</option>
            <option>UI / UX Design</option>
            <option>AI Automation</option>
            <option>Web Experience</option>
            <option>Content Marketing</option>
          </select>
        </div>
        <div class="form-row">
          <label for="message">Project signal</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button class="button primary" type="submit">Send Signal ${iconArrow()}</button>
        <p class="form-status" data-form-status aria-live="polite"></p>
      </form>
    </div>
  </section>`;

  return layout({
    title: isLetsTalk ? "Let's Talk - Book a Free Strategy Call | ZORQ Studio" : "Start a Project - Contact ZORQ Studio",
    description:
      isLetsTalk
        ? "Book a free 30-minute strategy call with ZORQ Studio. We'll map your brand, your gaps, and the right creative system to close them."
        : "Ready to build a brand system that scales? Tell ZORQ Studio what you need. Response within 24 hours. No commitment required.",
    current: "contact",
    path,
    body
  });
}

export function blogsPage() {
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Signals from the creative intelligence frontier.</h1>
      <p>Notes on AI automation, brand systems, publishing workflows, and future-ready studio operations.</p>
    </div>
  </section>
  <section class="section blog-index">
    <div class="container blog-grid">
      ${blogPosts
        .map(
          (post) => `<a class="blog-card" href="/${post.slug}/" data-reveal>
            <img src="${post.image}" alt="${esc(post.title)} - ZORQ Studio blog" width="1400" height="900" loading="lazy" decoding="async" />
            <div>
              <span>${esc(post.category)} / ${esc(post.date)} / ${readingTime(post)} min read</span>
              <h2>${esc(post.title)}</h2>
              <p>${esc(post.excerpt)}</p>
            </div>
          </a>`
        )
        .join("")}
    </div>
  </section>
  ${ctaBlock("Want content systems that actually compound?", "We build SEO-aware brand and publishing engines that turn every new asset into more visibility, more clarity, and more qualified demand.")}`;

  return layout({
    title: "Blog - AI Automation & Brand Systems Insights | ZORQ Studio",
    description: "Notes from ZORQ Studio on AI automation, brand systems, publishing workflows, and future-ready creative operations.",
    current: "blogs",
    path: "/blogs/",
    body
  });
}

export function blogPostPage(post) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    author: { "@type": "Organization", name: "ZORQ Studio" },
    publisher: {
      "@type": "Organization",
      name: "ZORQ Studio",
      logo: { "@type": "ImageObject", url: `${site.origin}/assets/brand/zorq-logo-green.png` }
    },
    datePublished: post.publishedTime?.slice(0, 10) || "2025-11-17",
    dateModified: post.publishedTime?.slice(0, 10) || "2025-11-17",
    url: `${site.origin}/${post.slug}/`,
    image: `${site.origin}${post.image}`
  };
  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    : null;
  const body = `<article class="blog-post">
    <section class="case-hero section">
      <div class="container case-hero-grid" data-reveal>
        <div>
          <a class="text-link back-link" href="/blogs/">${iconArrow()} Back to Blog</a>
          <h1>${esc(post.title)}</h1>
          <p>${esc(post.excerpt)}</p>
        </div>
        <figure>
          <img src="${post.image}" alt="${esc(post.title)} - ZORQ Studio article visual" width="1400" height="900" fetchpriority="high" />
        </figure>
      </div>
    </section>
    <section class="section article-section">
      <div class="container article-body" data-reveal>
        <p class="article-meta">${esc(post.category)} / ${esc(post.date)} / ${readingTime(post)} min read</p>
        <div class="article-intro">
          ${post.intro.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
        </div>
        <div class="article-toc">
          <h2>What this article covers</h2>
          <ol>
            ${post.sections.map((section, index) => `<li><a href="#section-${index + 1}">${esc(section.heading)}</a></li>`).join("")}
          </ol>
        </div>
        <div class="article-takeaways">
          <h2>Key takeaways</h2>
          <ul>
            ${post.keyTakeaways.map((item) => `<li>${esc(item)}</li>`).join("")}
          </ul>
        </div>
        ${post.sections
          .map(
            (section, index) => `<section id="section-${index + 1}" class="article-block">
              <h2>${esc(section.heading)}</h2>
              ${section.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
              ${section.bullets ? `<ul>${section.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>` : ""}
            </section>`
          )
          .join("")}
        ${
          post.faqs?.length
            ? `<section class="article-faq">
              <h2>FAQ</h2>
              <div class="faq-stack">
                ${post.faqs
                  .map(
                    (item) => `<article class="faq-item">
                      <h3>${esc(item.question)}</h3>
                      <p>${esc(item.answer)}</p>
                    </article>`
                  )
                  .join("")}
              </div>
            </section>`
            : ""
        }
        <div class="related-links">
          <h2>Continue the signal</h2>
          <ul>
            ${post.relatedLinks.map((link) => `<li><a href="${link.href}">${esc(link.label)}</a></li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
  </article>
  ${ctaBlock("Turn insight into infrastructure.", "If the ideas here describe your bottleneck, ZORQ can build the system around it.")}`;

  return layout({
    title: post.seoTitle || `${post.title} | ZORQ Studio`,
    description: post.seoDescription || post.excerpt,
    current: "blogs",
    path: `/${post.slug}/`,
    image: post.image,
    body,
    metaType: "article",
    extraHead: `<meta property="article:published_time" content="${post.publishedTime || "2025-11-17T00:00:00+00:00"}" />
  <meta property="article:author" content="ZORQ Studio" />
  <meta property="article:section" content="${esc(post.category)}" />
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ""}`
  });
}

export function faqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Frequently Asked Questions</h1>
      <p>Answers about working with ZORQ Studio, our AI creative systems, website builds, publishing workflows, and project process.</p>
    </div>
  </section>
  <section class="section article-section">
    <div class="container article-body faq-page-body" data-reveal-stagger>
      <p class="article-meta">FAQ / ZORQ Studio / Creative Systems</p>
      <div class="faq-stack">
        ${faqEntries
          .map(
            (item) => `<article class="faq-item">
              <h2>${esc(item.question)}</h2>
              <p>${esc(item.answer)}</p>
            </article>`
          )
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBlock("Still have a question?", "If your project, launch, or brand system needs a more specific answer, start a conversation with ZORQ Studio.")}`;

  return layout({
    title: "FAQ | ZORQ Studio",
    description: "Frequently asked questions about ZORQ Studio, our AI creative systems, websites, branding, automation, and publishing workflows.",
    current: "faq",
    path: "/faq/",
    body,
    extraHead: `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`
  });
}

export function legalPage(kind) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms and Conditions";
  const path = isPrivacy ? "/privacy-policy/" : "/terms-and-conditions/";
  const legalSections = isPrivacy
    ? [
        [
          "Overview",
          "ZORQ Studio collects only the information needed to respond to inquiries, scope creative work, deliver services, and maintain a reliable website experience. We do not sell personal data, rent contact lists, or use project details for unrelated advertising."
        ],
        [
          "Information We Collect",
          "When you submit a form or contact us directly, we may receive your name, email address, company or brand context, project details, and any files or notes you choose to share. Basic technical data such as browser type, approximate location, device information, and page activity may be collected through standard hosting or analytics tools."
        ],
        [
          "How We Use Information",
          "We use submitted information to reply to requests, prepare proposals, manage project communication, improve our website, protect against misuse, and meet legal or administrative obligations. We keep access limited to people or service providers who need it for those purposes."
        ],
        [
          "Data Minimization & Retention",
          "We keep personal information only as long as it is useful for the reason it was provided, unless a longer period is required for contracts, accounting, security, or legal compliance. Project materials can be deleted on request when retention is no longer necessary."
        ],
        [
          "Your Rights",
          "Depending on your location, including GDPR-style privacy rights, you may request access, correction, deletion, restriction, or portability of your personal information. You may also object to certain processing where applicable."
        ],
        [
          "Contact",
          "For privacy requests, contact ZORQ Studio through the contact page or the social channels listed on this website. We will respond within a reasonable timeframe and may need to verify your identity before completing a request."
        ]
      ]
    : [
        [
          "Overview",
          "These Terms and Conditions govern use of the ZORQ Studio website and any inquiry you submit through it. By using the site, you agree to use it lawfully, respectfully, and without interfering with the experience or security of other visitors."
        ],
        [
          "Studio Services",
          "Information on this website describes creative, digital, content, automation, and strategy services in general terms. A project begins only after ZORQ Studio and the client agree to a separate proposal, scope of work, timeline, and payment terms."
        ],
        [
          "Intellectual Property",
          "The ZORQ Studio name, logo, website design, copy, visuals, and brand assets are owned by ZORQ Studio or used with permission. You may not copy, resell, reproduce, or modify site materials without written permission, except for ordinary sharing with proper context."
        ],
        [
          "Client Materials",
          "If you submit brand assets, briefs, files, or project information, you confirm that you have the right to share those materials with ZORQ Studio. We use submitted materials only to evaluate or deliver the requested work unless otherwise agreed."
        ],
        [
          "No Guaranteed Outcomes",
          "Case studies and examples describe past or illustrative results. Actual outcomes depend on market conditions, offer quality, implementation, budget, timing, and other factors outside ZORQ Studio's control."
        ],
        [
          "Contact",
          "Questions about these terms can be sent through the contact page or the social channels listed on this website."
        ]
      ];
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>${title}</h1>
      <p>${isPrivacy ? "Plain-language privacy terms for a creative digital studio." : "Clear website terms for visitors, clients, and project inquiries."}</p>
    </div>
  </section>
  <section class="section article-section">
    <div class="container article-body" data-reveal-stagger>
      ${legalSections.map(([heading, copy]) => `<section><h2>${esc(heading)}</h2><p>${esc(copy)}</p></section>`).join("")}
    </div>
  </section>`;

  return layout({
    title: `${title} | ZORQ Studio`,
    description: `${title} for ZORQ Studio.`,
    current: "legal",
    path,
    body
  });
}

export function notFoundPage() {
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Signal not found.</h1>
      <p>The page you are looking for moved outside the current orbit.</p>
      <a class="button primary" href="/">Return Home ${iconArrow()}</a>
    </div>
  </section>`;
  return layout({
    title: "Page Not Found | ZORQ Studio",
    description: "The requested ZORQ Studio page could not be found.",
    current: "404",
    path: "/404.html",
    body,
    robots: "noindex, nofollow"
  });
}
