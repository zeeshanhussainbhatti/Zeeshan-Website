// Shared layout pieces: <head>, header + mega menu, footer, mobile bottom nav.
import { site, categories } from "./data.mjs";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const waLink = (msg = "Hi Zeeshan, I'd like to discuss digital marketing for my business.") =>
  `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(msg)}`;
export { waLink };

// Placeholder for photos — swap the whole <div> for an <img> when your pictures are ready.
export const ph = (label, ratio = "4/5", extra = "") =>
  `<div class="ph ${extra}" style="aspect-ratio:${ratio}" role="img" aria-label="${esc(label)} (image placeholder)">
      <!-- REPLACE: <img src="assets/img/your-image.jpg" alt="${esc(label)}"> -->
      <i class="ri-image-add-line"></i><span>${esc(label)}</span>
    </div>`;


// Brand mark: a "Z" whose base stroke turns into a red growth arrow (Zeeshan + growth).
export const logoMark = (id = "lm") => `<svg class="logo__mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#b80f22"/><stop offset="1" stop-color="#ff3b4f"/></linearGradient></defs>
  <rect class="lm-bg" x="1" y="1" width="46" height="46" rx="13"/>
  <path class="lm-z" d="M11.5 13.5H28.5L11.5 34.5H21" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="lm-arrow" stroke="url(#${id})" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 34.5L36.5 19"/><path d="M30 19h6.5v6.5"/>
  </g>
</svg>`;
const logoText = `<span class="logo__text"><strong>Zeeshan Hussain <span>Bhatti</span></strong><small>Digital Marketing Expert</small></span>`;

export function head({ title, description, path, b, schema = [] }) {
  const canonical = `${site.url}/${path}`.replace(/index\.html$/, "");
  const ld = schema.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n");
  return `<!doctype html>
<html lang="en-PK">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#05060a">
<link rel="canonical" href="${canonical}">
<meta name="geo.region" content="PK-SD">
<meta name="geo.placename" content="Karachi">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_PK">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${b}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Sora:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${b}assets/vendor/remixicon/remixicon.css">
<link rel="stylesheet" href="${b}assets/css/style.css">
${ld}
</head>
<body>
<div class="preloader" aria-hidden="true"><div class="preloader__logo">${logoMark("lm-p")}</div><div class="preloader__bar"></div></div>
<div class="scroll-progress" aria-hidden="true"></div>
<div class="cursor-glow" aria-hidden="true"></div>
<a class="skip-link" href="#main">Skip to content</a>`;
}

function megaMenu(b) {
  const cols = categories
    .map(
      (c) => `
        <div class="mega__col">
          <a class="mega__head" href="${b}services.html#${c.key}"><i class="${c.icon}"></i>${c.name}</a>
          <ul>
            ${c.services
              .map(
                (s) => `<li><a href="${b}services/${s.slug}.html"><i class="${s.icon}"></i><span>${s.title}</span></a></li>`
              )
              .join("")}
          </ul>
        </div>`
    )
    .join("");
  return `
      <div class="mega" id="mega-services">
        <div class="mega__inner">
          ${cols}
          <div class="mega__promo">
            <span class="chip"><i class="ri-flashlight-line"></i> Free</span>
            <h4>Get a Free Digital Marketing Audit</h4>
            <p>I'll review your website, Google profile and ads — and send you a clear growth plan.</p>
            <a class="btn btn--red btn--sm" href="${b}connect.html">Claim My Audit <i class="ri-arrow-right-up-line"></i></a>
          </div>
        </div>
      </div>`;
}

export function header(b, active) {
  const a = (k) => (active === k ? ' class="is-active" aria-current="page"' : "");
  return `
<header class="header" id="top">
  <div class="container header__inner">
    <a class="logo" href="${b}index.html" aria-label="${site.name} — Home">
      ${logoMark("lm-h")}
      ${logoText}
    </a>
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">
        <li><a href="${b}index.html"${a("home")}>Home</a></li>
        <li><a href="${b}about.html"${a("about")}>About Me</a></li>
        <li class="has-mega">
          <a href="${b}services.html"${a("services")} aria-haspopup="true" aria-expanded="false" aria-controls="mega-services">Services <i class="ri-arrow-down-s-line"></i></a>
          ${megaMenu(b)}
        </li>
        <li><a href="${b}blog.html"${a("blog")}>Blogs</a></li>
        <li><a href="${b}connect.html"${a("connect")}>Connect</a></li>
      </ul>
    </nav>
    <div class="header__actions">
      <a class="icon-btn" href="tel:+${site.phoneRaw}" aria-label="Call ${site.phone}"><i class="ri-phone-line"></i></a>
      <a class="btn btn--red btn--sm header__cta" href="${b}connect.html">Free Consultation <i class="ri-arrow-right-up-line"></i></a>
    </div>
  </div>
</header>`;
}

function mobileSheet(b) {
  return `
<div class="sheet" id="services-sheet" aria-hidden="true">
  <div class="sheet__backdrop" data-close-sheet></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="Services">
    <div class="sheet__grab"></div>
    <div class="sheet__head">
      <h3>Services</h3>
      <button class="icon-btn" data-close-sheet aria-label="Close"><i class="ri-close-line"></i></button>
    </div>
    <div class="sheet__body">
      ${categories
        .map(
          (c, i) => `
      <details class="acc"${i === 0 ? " open" : ""}>
        <summary><i class="${c.icon}"></i>${c.name}<i class="ri-add-line acc__plus"></i></summary>
        <div class="acc__grid">
          ${c.services.map((s) => `<a href="${b}services/${s.slug}.html"><i class="${s.icon}"></i>${s.title}</a>`).join("")}
        </div>
      </details>`
        )
        .join("")}
      <a class="btn btn--red btn--block" href="${b}services.html">View All Services <i class="ri-arrow-right-line"></i></a>
    </div>
  </div>
</div>`;
}

export function footer(b, active) {
  const a = (k) => (active === k ? " is-active" : "");
  return `
<footer class="footer">
  <div class="footer__glow" aria-hidden="true"></div>
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="logo" href="${b}index.html">${logoMark("lm-f")}${logoText}</a>
      <p>Karachi-based digital marketing expert with ${site.years}+ years helping businesses grow with SEO, performance marketing and premium design.</p>
      <div class="socials">
        <a href="${site.social.linkedin}" aria-label="LinkedIn"><i class="ri-linkedin-fill"></i></a>
        <a href="${site.social.facebook}" aria-label="Facebook"><i class="ri-facebook-fill"></i></a>
        <a href="${site.social.instagram}" aria-label="Instagram"><i class="ri-instagram-line"></i></a>
        <a href="${site.social.youtube}" aria-label="YouTube"><i class="ri-youtube-fill"></i></a>
        <a href="${site.social.x}" aria-label="X"><i class="ri-twitter-x-line"></i></a>
      </div>
    </div>
    ${categories
      .map(
        (c) => `
    <div class="footer__col">
      <h4>${c.name}</h4>
      <ul>${c.services.slice(0, 5).map((s) => `<li><a href="${b}services/${s.slug}.html">${s.title}</a></li>`).join("")}</ul>
    </div>`
      )
      .join("")}
    <div class="footer__col">
      <h4>Contact</h4>
      <ul class="footer__contact">
        <li><i class="ri-map-pin-line"></i><span>${site.address}</span></li>
        <li><i class="ri-phone-line"></i><a href="tel:+${site.phoneRaw}">${site.phone}</a></li>
        <li><i class="ri-mail-line"></i><a href="mailto:${site.email}">${site.email}</a></li>
        <li><i class="ri-time-line"></i><span>${site.hours}</span></li>
      </ul>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>© <span data-year></span> ${site.name}. All rights reserved.</p>
    <p>Digital Marketing Expert in Karachi · SEO · Google Ads · Meta Ads · Branding</p>
  </div>
</footer>

<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="ri-whatsapp-line"></i></a>
<button class="to-top" aria-label="Back to top"><i class="ri-arrow-up-line"></i></button>

<nav class="bottom-nav" aria-label="Mobile">
  <a href="${b}index.html" class="bottom-nav__item${a("home")}"><i class="ri-home-5-line"></i><span>Home</span></a>
  <button class="bottom-nav__item${a("services")}" data-open-sheet aria-controls="services-sheet"><i class="ri-apps-2-line"></i><span>Services</span></button>
  <a href="${waLink()}" class="bottom-nav__item bottom-nav__main" target="_blank" rel="noopener" aria-label="WhatsApp"><span class="bottom-nav__fab"><i class="ri-whatsapp-line"></i></span><span>WhatsApp</span></a>
  <a href="${b}blog.html" class="bottom-nav__item${a("blog")}"><i class="ri-article-line"></i><span>Blogs</span></a>
  <a href="${b}connect.html" class="bottom-nav__item${a("connect")}"><i class="ri-user-voice-line"></i><span>Connect</span></a>
</nav>
${mobileSheet(b)}
<script src="${b}assets/js/main.js" defer></script>
</body>
</html>`;
}

// Inner-page banner with breadcrumbs (also emits BreadcrumbList schema via caller)
export function pageHero({ b, eyebrow, title, text, crumbs }) {
  return `
<section class="page-hero">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container page-hero__inner reveal">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${b}index.html"><i class="ri-home-4-line"></i> Home</a>
      ${crumbs.map(([t, h]) => (h ? `<i class="ri-arrow-right-s-line"></i><a href="${b}${h}">${t}</a>` : `<i class="ri-arrow-right-s-line"></i><span>${t}</span>`)).join("")}
    </nav>
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    <p>${text}</p>
  </div>
</section>`;
}

export function ctaBand(b) {
  return `
<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <div class="cta-band__lines" aria-hidden="true"></div>
      <div>
        <span class="eyebrow eyebrow--light">Let's grow together</span>
        <h2>Ready to become the most visible business in Karachi?</h2>
        <p>Book a free 30-minute strategy call. No obligations — just a clear plan to get more leads and sales.</p>
      </div>
      <div class="cta-band__actions">
        <a class="btn btn--white" href="${b}connect.html">Book Free Call <i class="ri-calendar-check-line"></i></a>
        <a class="btn btn--ghost-light" href="${waLink()}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i> WhatsApp Me</a>
      </div>
    </div>
  </div>
</section>`;
}

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: `${site.name} — Digital Marketing Expert`,
  url: site.url,
  telephone: site.phone,
  email: site.email,
  priceRange: "$$",
  image: `${site.url}/assets/img/og.jpg`,
  logo: `${site.url}/assets/img/logo-mark.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.split(",")[0],
    addressLocality: "Karachi",
    addressRegion: "Sindh",
    addressCountry: "PK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 24.8607, longitude: 67.0011 },
  areaServed: { "@type": "City", name: "Karachi" },
  openingHours: "Mo-Sa 10:00-19:00",
  founder: { "@type": "Person", name: site.name, jobTitle: "Digital Marketing Expert" },
  sameAs: Object.values(site.social).filter((u) => u !== "#"),
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Digital Marketing Expert",
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
  knowsAbout: ["Digital Marketing", "SEO", "Local SEO", "Google Ads", "Meta Ads", "Graphic Design", "Performance Marketing"],
};

export const crumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${site.url}/${path}`,
  })),
});
