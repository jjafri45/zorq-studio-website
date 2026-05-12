import { blogPosts, caseStudies, process, services, site, testimonials } from "./content.mjs";

const year = "2026";

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function activeClass(current, href) {
  if (href === "/" && current === "home") return "is-active";
  if (href.includes("services") && current === "services") return "is-active";
  if (href.includes("case-studies") && current === "work") return "is-active";
  if (href.includes("about-us") && current === "studio") return "is-active";
  if (href.includes("contact") && current === "contact") return "is-active";
  return "";
}

function iconArrow() {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function sectionIntro(title, copy, align = "") {
  return `<div class="section-intro ${align}">
    <h2>${esc(title)}</h2>
    ${copy ? `<p>${esc(copy)}</p>` : ""}
  </div>`;
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
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
          <span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" data-mobile-menu>
      <nav aria-label="Mobile navigation">${links}</nav>
      <a class="button primary" href="/contact/">Start a Project ${iconArrow()}</a>
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
      <a class="footer-cta" href="/contact/">Let's Build ${iconArrow()}</a>
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
      <form class="newsletter" data-newsletter>
        <h3>Get updates</h3>
        <label for="newsletter-email">Email address</label>
        <div class="input-line">
          <input id="newsletter-email" name="email" type="email" placeholder="studio@brand.com" required />
          <button type="submit" aria-label="Subscribe">${iconArrow()}</button>
        </div>
        <p data-form-status aria-live="polite"></p>
      </form>
    </div>
    <div class="footer-bottom">
      <span>Copyright ${year} ZORQ Studio. All rights reserved.</span>
      <span><a href="/privacy-policy/">Privacy Policy</a> / <a href="/terms-and-conditions/">Terms</a></span>
    </div>
  </footer>`;
}

function layout({ title, description, current, body, path = "/", image = "/assets/images/deep-space.webp" }) {
  const canonical = `${site.origin}${path === "/" ? "/" : path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="theme-color" content="#0a0a0a" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${site.origin}${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" type="image/png" href="/assets/brand/favicon.png" />
  <link rel="preload" href="/assets/fonts/Orbitron-VariableFont_wght.ttf" as="font" type="font/ttf" crossorigin />
  <link rel="preload" href="/assets/fonts/Rajdhani-SemiBold.ttf" as="font" type="font/ttf" crossorigin />
  <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body data-page="${esc(current)}">
  ${header(current)}
  <main id="main">${body}</main>
  ${footer()}
  <script type="module" src="/assets/main.js"></script>
</body>
</html>`;
}

function heroVisual() {
  return `<div class="hero-visual" aria-label="ZORQ cosmic AI visual system">
    <img class="hero-portrait" src="/assets/images/hero-operator.webp" alt="Green futuristic creative operator for ZORQ Studio" width="1000" height="667" />
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
        <a class="button primary" href="/contact/">Start a Project ${iconArrow()}</a>
      </div>
    </div>
  </section>`;
}

function serviceList(limit = services.length) {
  return `<div class="service-list">
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
  return `<div class="work-grid">
    ${items
      .map(
        (item, index) => `<a class="work-card ${index === 0 ? "featured" : ""}" href="/case-studies/${item.slug}/" data-reveal>
          <figure>
            <img src="${item.image}" alt="${esc(item.alt)}" width="1400" height="900" loading="${index < 2 ? "eager" : "lazy"}" />
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
      <div class="process-grid">
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

function testimonialsSection() {
  return `<section class="section testimonial-section" data-reveal>
    <div class="container">
      ${sectionIntro("Client signal.", "What matters is not decoration. It is the velocity, clarity, and confidence the work creates.")}
      <div class="testimonial-grid">
        ${testimonials
          .map(
            (item) => `<figure>
              <blockquote>${esc(item.quote)}</blockquote>
              <figcaption>${esc(item.name)} <span>${esc(item.company)}</span></figcaption>
            </figure>`
          )
          .join("")}
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

  ${processSection()}

  <section class="section why-section" data-reveal>
    <div class="container why-grid">
      <div>
        <h2>Design intelligence for brands that refuse average.</h2>
        <p>We pair taste with systems thinking, so the result is not just beautiful. It is clear, scalable, fast, and built to learn.</p>
      </div>
      <div class="why-stack">
        <article><span>01</span><h3>AI-enhanced creative systems</h3><p>Generate, evaluate, and scale more ideas without losing a single brand rule.</p></article>
        <article><span>02</span><h3>Brand clarity</h3><p>Sharper positioning, stronger visual consistency, and fewer decisions that drift.</p></article>
        <article><span>03</span><h3>Conversion-focused execution</h3><p>Creative systems designed around action, measurement, and post-launch momentum.</p></article>
      </div>
    </div>
  </section>

  ${testimonialsSection()}
  ${ctaBlock()}`;

  return layout({
    title: "ZORQ Studio | AI-Powered Creative Studio",
    description: site.description,
    current: "home",
    path: "/",
    body
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
    <div class="container">
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
  ${processSection()}
  ${ctaBlock("Let's architect your creative operating system.", "Tell us what you are building and where the bottleneck lives. We will turn it into a clear system, not a messy wish list.")}`;

  return layout({
    title: "Services | ZORQ Studio",
    description:
      "Explore ZORQ Studio services across AI automation, UI/UX, branding, content marketing, strategy, and web experiences.",
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
    title: "Case Studies | ZORQ Studio",
    description:
      "Explore ZORQ Studio case studies across AI automation, publishing systems, SaaS dashboards, brand ecosystems, and launch engines.",
    current: "work",
    path: "/case-studies/",
    body
  });
}

export function caseStudyPage(item) {
  const related = caseStudies.filter((study) => study.slug !== item.slug).slice(0, 3);
  const body = `<article class="case-page">
    <section class="case-hero section">
      <div class="container case-hero-grid" data-reveal>
        <div>
          <a class="text-link back-link" href="/case-studies/">${iconArrow()} All Work</a>
          <h1>${esc(item.title)}</h1>
          <p>${esc(item.headline)}</p>
        </div>
        <figure>
          <img src="${item.image}" alt="${esc(item.alt)}" width="1400" height="900" />
        </figure>
      </div>
    </section>
    <section class="section case-story">
      <div class="container case-story-grid">
        <aside data-reveal>
          <span>${esc(item.category)}</span>
          <strong>${esc(item.impact)}</strong>
        </aside>
        <div class="case-content" data-reveal>
          <h2>The challenge</h2>
          <p>${esc(item.challenge)}</p>
          <h2>The ZORQ solution</h2>
          <ul>${item.solution.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
          <h2>Results</h2>
          <ul class="results-list">${item.results.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
    <section class="section related-work">
      <div class="container">
        ${sectionIntro("More systems in orbit.", "Adjacent work from the same AI-powered creative operating model.")}
        ${workGrid(related)}
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
      <h1>AI automates. Creativity elevates.</h1>
      <p>ZORQ Studio engineers intelligent systems that design, write, optimize, and scale brands without turning them generic.</p>
    </div>
  </section>
  <section class="section studio-section">
    <div class="container studio-grid">
      <figure data-reveal>
        <img src="/assets/images/cyberbot-orbit.webp" alt="Cybernetic figure moving through a cosmic interface." width="1400" height="700" />
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
    title: "About ZORQ Studio | AI-Powered Creative Studio",
    description:
      "Meet ZORQ Studio, an AI-powered creative agency building brand systems, digital experiences, and automation loops.",
    current: "studio",
    path: "/about-us/",
    body
  });
}

export function contactPage(path = "/contact/") {
  const body = `<section class="page-hero section contact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>Tell us what you want the future to feel like.</h1>
      <p>Start with a brand, product, launch, or messy creative system. We will translate it into a focused next move.</p>
    </div>
  </section>
  <section class="section contact-section">
    <div class="container contact-grid">
      <div class="contact-copy" data-reveal>
        <h2>Start a project.</h2>
        <p>Use the form for brand systems, websites, AI automation, content engines, campaigns, or case-study-worthy experiments.</p>
        <div class="contact-lines">
          <a href="/case-studies/">View recent work</a>
          <a href="https://www.instagram.com/zorqstudio/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/zorQstudio/" target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
      <form class="project-form" data-contact-form data-reveal>
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
    title: "Contact | ZORQ Studio",
    description:
      "Start a project with ZORQ Studio for AI-powered branding, UI/UX, web experiences, content systems, and automation.",
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
            <img src="${post.image}" alt="" width="1400" height="900" loading="lazy" />
            <div>
              <span>${esc(post.category)} / ${esc(post.date)}</span>
              <h2>${esc(post.title)}</h2>
              <p>${esc(post.excerpt)}</p>
            </div>
          </a>`
        )
        .join("")}
    </div>
  </section>`;

  return layout({
    title: "Blogs | ZORQ Studio",
    description: "Read ZORQ Studio insights on AI automation, creative intelligence, publishing systems, and brand strategy.",
    current: "blogs",
    path: "/blogs/",
    body
  });
}

export function blogPostPage(post) {
  const body = `<article class="blog-post">
    <section class="case-hero section">
      <div class="container case-hero-grid" data-reveal>
        <div>
          <a class="text-link back-link" href="/blogs/">${iconArrow()} All Posts</a>
          <h1>${esc(post.title)}</h1>
          <p>${esc(post.excerpt)}</p>
        </div>
        <figure>
          <img src="${post.image}" alt="" width="1400" height="900" />
        </figure>
      </div>
    </section>
    <section class="section article-section">
      <div class="container article-body" data-reveal>
        <p class="article-meta">${esc(post.category)} / ${esc(post.date)}</p>
        ${post.sections.map((section) => `<h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p>`).join("")}
      </div>
    </section>
  </article>
  ${ctaBlock("Turn insight into infrastructure.", "If the ideas here describe your bottleneck, ZORQ can build the system around it.")}`;

  return layout({
    title: `${post.title} | ZORQ Studio`,
    description: post.excerpt,
    current: "blogs",
    path: `/${post.slug}/`,
    image: post.image,
    body
  });
}

export function legalPage(kind) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms and Conditions";
  const path = isPrivacy ? "/privacy-policy/" : "/terms-and-conditions/";
  const body = `<section class="page-hero section compact-hero">
    <div class="container page-hero-grid" data-reveal>
      <h1>${title}</h1>
      <p>This page preserves the existing legal route. Please review final legal language before production launch.</p>
    </div>
  </section>
  <section class="section article-section">
    <div class="container article-body" data-reveal>
      <h2>Overview</h2>
      <p>ZORQ Studio respects user trust and aims to keep data practices clear, minimal, and purposeful.</p>
      <h2>Information</h2>
      <p>Project inquiries may include name, email, company context, and message details submitted voluntarily through forms.</p>
      <h2>Use</h2>
      <p>Submitted information is used to respond to inquiries, scope projects, improve services, and maintain studio operations.</p>
      <h2>Review</h2>
      <p>Replace this placeholder with approved legal copy before publishing the redesigned website.</p>
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
    body
  });
}
