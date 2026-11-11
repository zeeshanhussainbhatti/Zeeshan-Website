// Static site generator — run:  node src/build.mjs
// Writes plain HTML files into the project root (index.html, services/, blog/ ...).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, categories, posts, portfolio, areas, faqs, pricing, seoGame } from "./data.mjs";
import {
  head, header, footer, pageHero, ctaBand, ph, esc, waLink,
  businessSchema, personSchema, crumbSchema,
} from "./layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const written = [];
const out = (path, html) => {
  const full = join(ROOT, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  written.push(path);
};
const page = ({ path, active, title, description, schema, body }) => {
  const b = path.includes("/") ? "../" : "";
  out(path, head({ title, description, path, b, schema }) + header(b, active) + `\n<main id="main">${body(b)}</main>` + footer(b, active));
};

// Animated "New SEO" roadmap geometry (SVG viewBox 1200 x 660): a 3-row snake.
const SG_START = [70, 110];
const SG_NODES = [[300, 110], [620, 110], [940, 110], [940, 330], [620, 330], [300, 330], [300, 550], [620, 550], [940, 550]];
const SG_END = [1130, 550];
const SG_PATH = "M70 110 H1050 Q1110 110 1110 170 V270 Q1110 330 1050 330 H150 Q90 330 90 390 V490 Q90 550 150 550 H1130";

const allServices = categories.flatMap((c) => c.services.map((s) => ({ ...s, cat: c })));
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const faqSchema = (list) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: list.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const sectionHead = (eyebrow, title, text = "", center = true) => `
    <div class="section-head${center ? " section-head--center" : ""} reveal">
      <span class="eyebrow">${eyebrow}</span>
      <h2>${title}</h2>
      ${text ? `<p>${text}</p>` : ""}
    </div>`;

const faqList = (list) =>
  list
    .map(
      ([q, a], i) => `
      <details class="faq"${i === 0 ? " open" : ""}>
        <summary><span>${q}</span><i class="ri-add-line"></i></summary>
        <div class="faq__a"><p>${a}</p></div>
      </details>`
    )
    .join("");

const postCard = (b, p) => `
      <article class="post-card reveal">
        <a href="${b}blog/${p.slug}.html" class="post-card__media">${ph(p.cat + " article cover", "16/10")}<span class="chip chip--abs">${p.cat}</span></a>
        <div class="post-card__body">
          <div class="post-card__meta"><span><i class="ri-calendar-line"></i>${fmtDate(p.date)}</span><span><i class="ri-time-line"></i>${p.read} min read</span></div>
          <h3><a href="${b}blog/${p.slug}.html">${p.title}</a></h3>
          <p>${p.excerpt}</p>
          <a class="link-arrow" href="${b}blog/${p.slug}.html">Read Article <i class="ri-arrow-right-line"></i></a>
        </div>
      </article>`;

const contactForm = (b, compact = false) => `
      <form class="form glass" id="lead-form" data-wa="${site.phoneRaw}" novalidate>
        <div class="form__row">
          <label><span>Your Name *</span><input name="name" required placeholder="e.g. Ahmed Khan" autocomplete="name"></label>
          <label><span>Phone / WhatsApp *</span><input name="phone" type="tel" required placeholder="03XX XXXXXXX" autocomplete="tel"></label>
        </div>
        <div class="form__row">
          <label><span>Business Name</span><input name="business" placeholder="Your business"></label>
          <label><span>Service Needed</span>
            <select name="service">
              <option>Not sure yet — need advice</option>
              ${categories.map((c) => `<optgroup label="${c.name}">${c.services.map((s) => `<option>${s.title}</option>`).join("")}</optgroup>`).join("")}
            </select>
          </label>
        </div>
        ${compact ? "" : `<label><span>Monthly Marketing Budget</span>
          <select name="budget"><option>Under PKR 50,000</option><option>PKR 50,000 – 150,000</option><option>PKR 150,000 – 500,000</option><option>PKR 500,000+</option></select></label>`}
        <label><span>Tell me about your goals</span><textarea name="message" rows="${compact ? 3 : 4}" placeholder="I want more leads / sales / calls from Karachi..."></textarea></label>
        <button class="btn btn--red btn--block" type="submit"><i class="ri-whatsapp-line"></i> Send via WhatsApp</button>
        <p class="form__note"><i class="ri-lock-line"></i> Your details are sent directly to my WhatsApp. I reply within a few hours.</p>
      </form>`;

// =====================================================================
// HOME
// =====================================================================
const slides = [
  {
    eyebrow: "Karachi-Based Digital Marketing Expert",
    h: `Grow Your Business With <span class="text-red">Data-Driven</span> Digital Marketing`,
    p: `I'm Zeeshan Hussain Bhatti — ${site.years}+ years helping Karachi brands get more leads, calls and sales through SEO, Google Ads, Meta Ads and premium design.`,
    photo: "Your Photo — Hero Slide 1",
    img: "assets/img/zeeshan-hero-1.webp",
  },
  {
    eyebrow: "Local SEO Specialist · Karachi",
    h: `Rank #1 on Google Maps in <span class="text-red">DHA, Clifton</span> &amp; All of Karachi`,
    p: "Get found by customers near you. Google Business Profile optimization, local citations and review strategies that make your phone ring.",
    photo: "Your Photo — Hero Slide 2",
    img: "assets/img/zeeshan-hero-2.webp",
  },
  {
    eyebrow: "Performance Marketing · ROI First",
    h: `Ads That Pay For Themselves — <span class="text-red">Measured in Sales</span>`,
    p: "Google, Meta, TikTok and LinkedIn campaigns built around ROAS and cost per lead — with transparent reporting every week.",
    photo: "Your Photo — Hero Slide 3",
  },
];

page({
  path: "index.html",
  active: "home",
  title: "Zeeshan Hussain Bhatti | Digital Marketing Expert in Karachi | SEO & Ads",
  description: `Karachi-based digital marketing expert with ${site.years}+ years of experience. SEO, Local SEO, Google Ads, Meta Ads, social media and graphic design for businesses in Karachi, Pakistan.`,
  schema: [businessSchema, personSchema, faqSchema(faqs)],
  body: (b) => `
<!-- ============ HERO SLIDER ============ -->
<section class="hero" aria-roledescription="carousel" aria-label="Introduction">
  <canvas class="hero__net" aria-hidden="true"></canvas>
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="container hero__track">
    ${slides
      .map(
        (s, i) => `
    <div class="slide slide--${i + 1}${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}">
      <div class="slide__content">
        <span class="eyebrow"><span class="pulse-dot"></span>${s.eyebrow}</span>
        ${i === 0 ? `<h1>${s.h}</h1>` : `<h2 class="h1">${s.h}</h2>`}
        <p class="lead">${s.p}</p>
        ${i === 0 ? `<p class="typed-line">I help you with <span class="typed" data-words="SEO & Local SEO|Google Ads|Meta Ads|Social Media|Brand Identity|E-commerce Growth"></span><span class="caret"></span></p>` : ""}
        <div class="btn-row">
          <a class="btn btn--red" href="${b}connect.html">Get Free Audit <i class="ri-arrow-right-up-line"></i></a>
          <a class="btn btn--ghost" href="#portfolio"><i class="ri-play-circle-line"></i> View My Work</a>
        </div>
        <div class="hero__trust">
          <div class="avatars"><span></span><span></span><span></span><span></span></div>
          <div><strong>500+ Businesses</strong><small>trust me with their growth</small></div>
        </div>
      </div>
      <div class="slide__visual">
        <div class="orbit orbit--1" aria-hidden="true"></div>
        <div class="orbit orbit--2" aria-hidden="true"></div>
        <div class="photo-frame">
          ${s.img
            ? `<div class="ph ph--hero ph--filled" style="aspect-ratio:4/5"><img src="${b}${s.img}" alt="Zeeshan Hussain Bhatti — Digital Marketing Expert in Karachi" width="864" height="1080" decoding="async"></div>`
            : ph(s.photo, "4/5", "ph--hero")}
          <div class="photo-frame__corner photo-frame__corner--tl"></div><div class="photo-frame__corner photo-frame__corner--br"></div>
        </div>
        <div class="float-card float-card--a"><i class="ri-line-chart-line"></i><div><strong>+320%</strong><small>Organic Traffic</small></div></div>
        <div class="float-card float-card--b"><i class="ri-map-pin-2-fill"></i><div><strong>Top 3</strong><small>Google Map Pack</small></div></div>
        <div class="float-card float-card--c"><i class="ri-award-line"></i><div><strong>${site.years}+ Years</strong><small>Experience</small></div></div>
      </div>
    </div>`
      )
      .join("")}
  </div>
  <div class="container hero__controls">
    <div class="hero__dots" role="tablist" aria-label="Choose slide">
      ${slides.map((_, i) => `<button class="dot${i === 0 ? " is-active" : ""}" role="tab" aria-label="Slide ${i + 1}" data-slide="${i}"><span></span></button>`).join("")}
    </div>
    <div class="hero__arrows">
      <button class="icon-btn" data-prev aria-label="Previous slide"><i class="ri-arrow-left-line"></i></button>
      <button class="icon-btn" data-next aria-label="Next slide"><i class="ri-arrow-right-line"></i></button>
    </div>
  </div>
  <a href="#stats" class="hero__scroll" aria-label="Scroll down"><span></span></a>
</section>

<!-- ============ PLATFORMS MARQUEE ============ -->
<div class="marquee" aria-label="Platforms I work with">
  <div class="marquee__track">
    ${Array(2).fill(["ri-google-fill Google Ads", "ri-meta-fill Meta Ads", "ri-tiktok-fill TikTok Ads", "ri-linkedin-box-fill LinkedIn", "ri-shopping-bag-3-fill Shopify", "ri-wordpress-fill WordPress", "ri-bar-chart-2-fill GA4", "ri-youtube-fill YouTube", "ri-whatsapp-fill WhatsApp Business", "ri-instagram-fill Instagram"]
      .map((t) => { const [ic, ...n] = t.split(" "); return `<span><i class="${ic}"></i>${n.join(" ")}</span>`; }).join("")).join("")}
  </div>
</div>

<!-- ============ STATS ============ -->
<section class="section section--tight" id="stats">
  <div class="container stats">
    ${[["13", "+", "Years of Experience", "ri-award-line"], ["500", "+", "Projects Delivered", "ri-rocket-2-line"], ["250", "+", "Happy Clients", "ri-emotion-happy-line"], ["50", "M+", "PKR Ad Spend Managed", "ri-money-dollar-circle-line"]]
      .map(([n, s, l, ic]) => `
    <div class="stat reveal"><i class="${ic}"></i><strong><span data-count="${n}">0</span>${s}</strong><span>${l}</span></div>`).join("")}
  </div>
</section>

<!-- ============ ABOUT ============ -->
<section class="section" id="about">
  <div class="container split">
    <div class="split__media reveal">
      <div class="about-media">
        ${ph("Your Photo — About Section", "4/5")}
        <div class="about-badge"><strong>${site.years}+</strong><span>Years<br>Experience</span></div>
        <div class="about-chip"><i class="ri-map-pin-2-fill"></i> Based in Karachi</div>
      </div>
    </div>
    <div class="split__content reveal">
      <span class="eyebrow">About Me</span>
      <h2>Your Local Growth Partner in <span class="text-red">Karachi</span></h2>
      <p class="lead">Assalam-o-Alaikum! I'm <strong>Zeeshan Hussain Bhatti</strong>, a professional digital marketing expert based in Karachi with over ${site.years} years of hands-on experience.</p>
      <p>From small shops in Tariq Road to corporate brands on I.I. Chundrigar Road, I've helped hundreds of Pakistani businesses grow online. I understand how Karachi customers search, scroll and buy — and I turn that knowledge into strategies that bring real leads, calls and sales.</p>
      <ul class="checks">
        <li><i class="ri-checkbox-circle-fill"></i>Certified in Google Ads &amp; Meta Ads</li>
        <li><i class="ri-checkbox-circle-fill"></i>Local SEO &amp; Google Maps specialist</li>
        <li><i class="ri-checkbox-circle-fill"></i>In-house graphic design &amp; branding</li>
        <li><i class="ri-checkbox-circle-fill"></i>Transparent reporting — no fluff</li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--red" href="${b}about.html">More About Me <i class="ri-arrow-right-line"></i></a>
        <a class="btn btn--ghost" href="tel:+${site.phoneRaw}"><i class="ri-phone-line"></i> ${site.phone}</a>
      </div>
    </div>
  </div>
</section>

<!-- ============ SERVICES ============ -->
<section class="section section--dark" id="services">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead("What I Do", `Full-Stack Digital Marketing <span class="text-red">Services</span>`, "Three core pillars — everything your business needs to be found, look premium and sell more, under one roof.")}
    <div class="pillars">
      ${categories
        .map(
          (c, i) => `
      <article class="pillar tilt reveal" style="--d:${i * 0.1}s">
        <div class="pillar__num">0${i + 1}</div>
        <div class="pillar__icon"><i class="${c.icon}"></i></div>
        <h3>${c.name}</h3>
        <p>${c.blurb}</p>
        <ul>${c.services.slice(0, 5).map((s) => `<li><a href="${b}services/${s.slug}.html"><i class="ri-arrow-right-up-line"></i>${s.title}</a></li>`).join("")}</ul>
        <a class="link-arrow" href="${b}services.html#${c.key}">Explore ${c.name} <i class="ri-arrow-right-line"></i></a>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>

<!-- ============ THE NEW SEO GAME (animated) ============ -->
<section class="section seo-game" id="seo-game">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">Search Everywhere Optimisation</span>
      <h2>The <span class="text-red">“New SEO”</span> Game</h2>
      <p>SEO is no longer just Google. I make your brand visible everywhere your customers search — Google, AI assistants, YouTube, TikTok and online communities.</p>
    </div>
    <div class="sg" data-sg>
      <svg class="sg__svg" viewBox="0 0 1200 660" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="sg-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b4f"/><stop offset="1" stop-color="#b80f22"/></linearGradient>
          <filter id="sg-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path class="sg__track" d="${SG_PATH}"/>
        <path class="sg__flow" d="${SG_PATH}"/>
        <path class="sg__line" d="${SG_PATH}" stroke="url(#sg-grad)"/>
        <circle class="sg__comet" r="5" filter="url(#sg-glow)"/>
        <circle class="sg__player" r="9" filter="url(#sg-glow)"/>
      </svg>
      <div class="sg__start" style="left:${(SG_START[0] / 12).toFixed(3)}%;top:${(SG_START[1] / 6.6).toFixed(3)}%">START</div>
      ${seoGame
        .map(
          (l, i) => `
      <article class="sg__level" data-level="${i}" style="left:${(SG_NODES[i][0] / 12).toFixed(3)}%;top:${(SG_NODES[i][1] / 6.6).toFixed(3)}%">
        <span class="sg__lvl">Level ${i + 1}</span>
        <div class="sg__card">
          <i class="${l.icon}"></i>
          <div><h3>${l.title}</h3><p>${l.desc}</p></div>
        </div>
      </article>`
        )
        .join("")}
      <div class="sg__finish" style="left:${(SG_END[0] / 12).toFixed(3)}%;top:${(SG_END[1] / 6.6).toFixed(3)}%" aria-hidden="true">
        <svg class="sg__flag" viewBox="0 0 40 48"><path class="sg__pole" d="M6 2v44"/><path class="sg__cloth" d="M7 4c8-4 14 4 26 0v18c-12 4-18-4-26 0z"/></svg>
        <span class="sg__pad"></span>
      </div>
    </div>
    <div class="center mt-40 reveal">
      <a class="btn btn--red" href="${b}services/seo-services-karachi.html">Start Winning the New SEO Game <i class="ri-arrow-right-up-line"></i></a>
    </div>
  </div>
</section>

<!-- ============ PROCESS ============ -->
<section class="section" id="process">
  <div class="container">
    ${sectionHead("How I Work", `A Proven 4-Step <span class="text-red">Growth Process</span>`, "No guesswork. Every campaign follows a clear system built on research, execution and measurement.")}
    <div class="process">
      ${[["ri-search-line", "Discover & Audit", "Deep dive into your business, competitors in Karachi, website, Google profile and current ads."], ["ri-road-map-line", "Strategy & Plan", "A clear roadmap with channels, budget, KPIs and a 90-day action plan you can understand."], ["ri-rocket-line", "Launch & Execute", "SEO, campaigns and creatives go live — built, tested and optimized by an expert."], ["ri-bar-chart-grouped-line", "Measure & Scale", "Weekly optimization and monthly reports. We scale what works and cut what doesn't."]]
        .map(([ic, t, d], i) => `
      <div class="step reveal" style="--d:${i * 0.1}s">
        <div class="step__icon"><i class="${ic}"></i><span>0${i + 1}</span></div>
        <h3>${t}</h3><p>${d}</p>
      </div>`).join("")}
    </div>
  </div>
</section>

<!-- ============ PORTFOLIO ============ -->
<section class="section section--dark" id="portfolio">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <div><span class="eyebrow">Portfolio</span><h2>Selected <span class="text-red">Work</span> &amp; Results</h2></div>
      <div class="filters" role="tablist" aria-label="Filter portfolio">
        <button class="filter is-active" data-filter="all">All</button>
        ${categories.map((c) => `<button class="filter" data-filter="${c.key}">${c.name}</button>`).join("")}
      </div>
    </div>
    <div class="portfolio">
      ${portfolio
        .map(
          (p, i) => `
      <article class="work reveal${i === 0 || i === 3 ? " work--wide" : ""}" data-cat="${p.cat}">
        ${ph("Project image — " + p.title, i === 0 || i === 3 ? "16/9" : "4/3")}
        <div class="work__overlay">
          <span class="chip">${p.tag}</span>
          <h3>${p.title}</h3>
          <p class="work__result"><i class="ri-arrow-right-up-line"></i>${p.result}</p>
        </div>
      </article>`
        )
        .join("")}
    </div>
    <div class="center mt-40 reveal"><a class="btn btn--ghost" href="${b}connect.html">Want results like these? Let's talk <i class="ri-arrow-right-line"></i></a></div>
  </div>
</section>

<!-- ============ CASE STUDIES ============ -->
<section class="section" id="results">
  <div class="container">
    ${sectionHead("Case Studies", `Real Numbers. <span class="text-red">Real Growth.</span>`)}
    <div class="cases">
      ${[["Healthcare · Clifton", "Dental Clinic", "Google Ads + Local SEO", [["-45%", "Cost per lead"], ["3.1x", "Appointments"], ["#1", "Map ranking"]]], ["E-commerce · Karachi", "Fashion Brand", "Meta Ads + Creatives", [["6.2x", "ROAS"], ["+180%", "Monthly sales"], ["-30%", "COD returns"]]], ["Real Estate · DHA", "Property Developer", "Lead Gen Funnel", [["1,200+", "Qualified leads"], ["PKR 380", "Cost per lead"], ["90", "Days"]]]]
        .map(([tag, name, svc, nums], i) => `
      <article class="case glass reveal" style="--d:${i * 0.1}s">
        <div class="case__top"><span class="chip">${tag}</span><i class="ri-arrow-right-up-line"></i></div>
        <h3>${name}</h3><p>${svc}</p>
        <div class="case__nums">${nums.map(([n, l]) => `<div><strong>${n}</strong><small>${l}</small></div>`).join("")}</div>
        <div class="case__bar"><span style="--w:${[78, 92, 85][i]}%"></span></div>
      </article>`).join("")}
    </div>
  </div>
</section>

<!-- ============ WHY ME ============ -->
<section class="section section--dark" id="why">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container split split--rev">
    <div class="split__content reveal">
      <span class="eyebrow">Why Choose Me</span>
      <h2>Not an Agency. <span class="text-red">An Expert</span> Who Owns Your Results.</h2>
      <p class="lead">You get ${site.years}+ years of experience working directly on your account — with the speed and accountability that big agencies can't offer.</p>
      <div class="why-grid">
        ${[["ri-user-star-line", "Direct Expert Access", "No juniors. You talk to me."], ["ri-map-2-line", "Karachi Market Insight", "I know your local customers."], ["ri-file-chart-line", "Transparent Reports", "Clear numbers, every month."], ["ri-shake-hands-line", "No Long Contracts", "Stay because it works."]]
          .map(([ic, t, d]) => `<div class="why"><i class="${ic}"></i><div><h3>${t}</h3><p>${d}</p></div></div>`).join("")}
      </div>
    </div>
    <div class="split__media reveal">
      <div class="dash glass" aria-hidden="true">
        <div class="dash__head"><span></span><span></span><span></span><small>growth-dashboard.live</small></div>
        <div class="dash__kpis">
          <div><small>Leads</small><strong>1,284</strong><em class="up">+38%</em></div>
          <div><small>ROAS</small><strong>5.8x</strong><em class="up">+1.2</em></div>
          <div><small>CPL</small><strong>PKR 412</strong><em class="down">-27%</em></div>
        </div>
        <div class="dash__chart">${Array.from({ length: 12 }, (_, i) => `<span style="--h:${[30, 42, 38, 55, 48, 62, 58, 70, 66, 80, 76, 92][i]}%"></span>`).join("")}</div>
        <div class="dash__foot"><span><i class="ri-checkbox-blank-circle-fill"></i> Organic</span><span><i class="ri-checkbox-blank-circle-fill red"></i> Paid</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ INDUSTRIES ============ -->
<section class="section" id="industries">
  <div class="container">
    ${sectionHead("Industries", `Industries I <span class="text-red">Grow</span> in Karachi`)}
    <div class="industries">
      ${[["ri-restaurant-2-line", "Restaurants & Cafés"], ["ri-hospital-line", "Clinics & Healthcare"], ["ri-building-2-line", "Real Estate"], ["ri-graduation-cap-line", "Education"], ["ri-shirt-line", "Fashion & Apparel"], ["ri-store-2-line", "E-commerce"], ["ri-car-line", "Automotive"], ["ri-scissors-cut-line", "Salons & Beauty"], ["ri-plane-line", "Travel & Tourism"], ["ri-briefcase-4-line", "Corporate & B2B"], ["ri-home-gear-line", "Home Services"], ["ri-hotel-line", "Hotels & Events"]]
        .map(([ic, t], i) => `<div class="industry reveal" style="--d:${(i % 6) * 0.05}s"><i class="${ic}"></i><span>${t}</span></div>`).join("")}
    </div>
  </div>
</section>

<!-- ============ KARACHI AREAS (Local SEO) ============ -->
<section class="section section--dark" id="areas">
  <div class="container split">
    <div class="split__content reveal">
      <span class="eyebrow">Serving All of Karachi</span>
      <h2>Digital Marketing Services <span class="text-red">Near You</span></h2>
      <p class="lead">Whether your business is in DHA, Clifton, Gulshan-e-Iqbal or SITE Area — I help you reach customers in your neighbourhood and across Karachi.</p>
      <div class="areas">${areas.map((a) => `<span><i class="ri-map-pin-line"></i>${a}</span>`).join("")}</div>
    </div>
    <div class="split__media reveal">
      <div class="map-card">
        <iframe title="Zeeshan Hussain Bhatti location in Karachi" src="https://maps.google.com/maps?q=Shahrah-e-Faisal%20Karachi&t=&z=12&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div class="map-card__info glass"><i class="ri-map-pin-2-fill"></i><div><strong>${site.name}</strong><small>${site.address}</small></div></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ TOOLS / SKILLS ============ -->
<section class="section" id="skills">
  <div class="container split">
    <div class="split__content reveal">
      <span class="eyebrow">Skills &amp; Tools</span>
      <h2>Expertise Built Over <span class="text-red">${site.years}+ Years</span></h2>
      <div class="bars">
        ${[["SEO & Local SEO", 96], ["Google Ads / PPC", 94], ["Meta & TikTok Ads", 95], ["Graphic Design & Branding", 90], ["Analytics & Tracking", 92]]
          .map(([t, v]) => `<div class="bar"><div class="bar__label"><span>${t}</span><span>${v}%</span></div><div class="bar__track"><span style="--w:${v}%"></span></div></div>`).join("")}
      </div>
    </div>
    <div class="split__media reveal">
      <div class="tools">
        ${["Google Ads", "Meta Business", "GA4", "Tag Manager", "Search Console", "SEMrush", "Ahrefs", "Looker Studio", "Photoshop", "Illustrator", "Figma", "Canva", "Premiere Pro", "Shopify", "WordPress", "HubSpot"]
          .map((t) => `<span class="tool">${t}</span>`).join("")}
      </div>
    </div>
  </div>
</section>

<!-- ============ TESTIMONIALS ============ -->
<section class="section section--dark" id="testimonials">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <div><span class="eyebrow">Testimonials</span><h2>What Clients <span class="text-red">Say</span></h2></div>
      <div class="hero__arrows"><button class="icon-btn" data-t-prev aria-label="Previous testimonial"><i class="ri-arrow-left-line"></i></button><button class="icon-btn" data-t-next aria-label="Next testimonial"><i class="ri-arrow-right-line"></i></button></div>
    </div>
    <!-- REPLACE the sample text below with real reviews from your clients before going live. -->
    <div class="tslider" tabindex="0" aria-label="Client testimonials">
      ${[["Our clinic was invisible on Google. Within two months we were in the top 3 on Maps for our area and appointments nearly tripled.", "Clinic Owner", "Clifton, Karachi"], ["Zeeshan's Meta Ads strategy completely changed our online store. Clear reporting, great creatives and real sales.", "E-commerce Founder", "Gulshan-e-Iqbal, Karachi"], ["Professional, fast and honest. The new branding made our company look like a market leader.", "Managing Director", "PECHS, Karachi"], ["We finally know which ads bring customers. The tracking setup and dashboards were eye-opening.", "Marketing Manager", "DHA, Karachi"]]
        .map(([q, r, l]) => `
      <figure class="tcard glass">
        <div class="tcard__stars" aria-label="5 out of 5 stars"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i></div>
        <blockquote>“${q}”</blockquote>
        <figcaption><span class="tcard__avatar"><i class="ri-user-3-line"></i></span><div><strong>Client Name</strong><small>${r} · ${l}</small></div></figcaption>
        <i class="ri-double-quotes-r tcard__q" aria-hidden="true"></i>
      </figure>`).join("")}
    </div>
  </div>
</section>

<!-- ============ PACKAGES / PRICING ============ -->
<section class="section" id="packages">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead("Packages", `Simple, Transparent <span class="text-red">Pricing</span>`, "Choose a monthly growth package — or let's build a custom plan around your goals and budget.")}
    <div class="billing reveal" role="radiogroup" aria-label="Billing period">
      <button class="billing__opt is-active" role="radio" aria-checked="true" data-billing="monthly">Monthly</button>
      <button class="billing__opt" role="radio" aria-checked="false" data-billing="quarterly">Quarterly <span class="billing__save">Save ${pricing.quarterlyDiscount}%</span></button>
      <span class="billing__pill" aria-hidden="true"></span>
    </div>
    <div class="plans" data-discount="${pricing.quarterlyDiscount}">
      ${pricing.packages
        .map(
          (pk, i) => `
      <article class="plan${pk.popular ? " plan--popular" : ""} reveal" style="--d:${i * 0.1}s">
        ${pk.popular ? `<span class="plan__badge"><i class="ri-fire-fill"></i> Most Popular</span>` : ""}
        <div class="plan__head">
          <span class="plan__icon"><i class="${pk.icon}"></i></span>
          <h3>${pk.name}</h3>
        </div>
        <p class="plan__tag">${pk.tagline}</p>
        <div class="plan__price">
          <span class="plan__cur">${pricing.currency}</span>
          <strong data-price="${pk.price}">${pk.price.toLocaleString("en-US")}</strong>
          <span class="plan__per">/ month</span>
        </div>
        <p class="plan__bill" data-bill>Billed monthly · cancel anytime</p>
        <a class="btn ${pk.popular ? "btn--red" : "btn--ghost"} btn--block" href="${waLink(`Hi Zeeshan, I'm interested in the ${pk.name} package.`)}" target="_blank" rel="noopener" data-plan="${pk.name}">Get ${pk.name} <i class="ri-arrow-right-up-line"></i></a>
        <ul class="plan__list">
          ${pk.features.map((f) => `<li><i class="ri-check-line"></i>${f}</li>`).join("")}
          ${pk.excluded.map((f) => `<li class="is-off"><i class="ri-close-line"></i>${f}</li>`).join("")}
        </ul>
      </article>`
        )
        .join("")}
    </div>
    <div class="plans-foot reveal">
      <div class="plans-foot__trust">
        <span><i class="ri-shake-hands-line"></i> No long-term contracts</span>
        <span><i class="ri-file-chart-line"></i> Transparent reporting</span>
        <span><i class="ri-shield-check-line"></i> Your ad accounts stay yours</span>
      </div>
      <div class="plans-custom glass">
        <div><h3>Need a custom plan?</h3><p>${pricing.note} Let's build a package around your exact goals.</p></div>
        <a class="btn btn--red" href="${b}connect.html">Get Custom Quote <i class="ri-arrow-right-up-line"></i></a>
      </div>
    </div>
  </div>
</section>

<!-- ============ FAQ ============ -->
<section class="section" id="faq">
  <div class="container split split--top">
    <div class="split__content reveal">
      <span class="eyebrow">FAQ</span>
      <h2>Questions Karachi Business Owners <span class="text-red">Ask Me</span></h2>
      <p class="lead">Can't find your answer? Message me on WhatsApp and I'll reply personally.</p>
      <a class="btn btn--red" href="${waLink("Hi Zeeshan, I have a question.")}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i> Ask on WhatsApp</a>
    </div>
    <div class="faqs reveal">${faqList(faqs)}</div>
  </div>
</section>

<!-- ============ BLOG ============ -->
<section class="section section--dark" id="blog">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <div><span class="eyebrow">Latest Insights</span><h2>From the <span class="text-red">Blog</span></h2></div>
      <a class="btn btn--ghost" href="${b}blog.html">View All Articles <i class="ri-arrow-right-line"></i></a>
    </div>
    <div class="posts">${posts.slice(0, 3).map((p) => postCard(b, p)).join("")}</div>
  </div>
</section>

<!-- ============ CONTACT ============ -->
<section class="section" id="contact">
  <div class="container split split--top">
    <div class="split__content reveal">
      <span class="eyebrow">Connect</span>
      <h2>Let's Build Your <span class="text-red">Growth Plan</span></h2>
      <p class="lead">Tell me about your business and goals. I'll get back with a free, no-obligation strategy within 24 hours.</p>
      <ul class="contact-list">
        <li><i class="ri-phone-line"></i><div><small>Call / WhatsApp</small><a href="tel:+${site.phoneRaw}">${site.phone}</a></div></li>
        <li><i class="ri-mail-line"></i><div><small>Email</small><a href="mailto:${site.email}">${site.email}</a></div></li>
        <li><i class="ri-map-pin-line"></i><div><small>Office</small><span>${site.address}</span></div></li>
        <li><i class="ri-time-line"></i><div><small>Hours</small><span>${site.hours}</span></div></li>
      </ul>
    </div>
    <div class="reveal">${contactForm(b, true)}</div>
  </div>
</section>
${ctaBand(b)}`,
});

// =====================================================================
// ABOUT
// =====================================================================
page({
  path: "about.html",
  active: "about",
  title: "About Zeeshan Hussain Bhatti | Digital Marketing Expert Karachi",
  description: `Meet Zeeshan Hussain Bhatti — a Karachi-based digital marketing expert with ${site.years}+ years of experience in SEO, performance marketing and graphic design.`,
  schema: [personSchema, crumbSchema([["Home", ""], ["About Me", "about.html"]])],
  body: (b) => `
${pageHero({ b, eyebrow: "About Me", title: `The Story Behind <span class="text-red">${site.years}+ Years</span> of Growth`, text: "Digital marketer, strategist and designer — helping Karachi businesses win online since the early days of social media in Pakistan.", crumbs: [["About Me"]] })}
<section class="section">
  <div class="container split">
    <div class="split__media reveal"><div class="about-media">${ph("Your Photo — About Page", "4/5")}<div class="about-badge"><strong>${site.years}+</strong><span>Years<br>Experience</span></div></div></div>
    <div class="split__content reveal">
      <span class="eyebrow">Who I Am</span>
      <h2>Hi, I'm Zeeshan Hussain Bhatti</h2>
      <p class="lead">A professional digital marketing expert from Karachi, Pakistan — obsessed with turning clicks into customers.</p>
      <p>My journey started more than ${site.years} years ago, when most Karachi businesses still relied on newspaper ads and billboards. I saw early how Google and social media would change everything — and I've been helping brands ride that wave ever since.</p>
      <p>Today I work with startups, local shops, clinics, real estate developers, e-commerce stores and corporate brands. My approach combines technical SEO, data-driven advertising and strong creative design, so every rupee you invest works harder.</p>
      <div class="btn-row"><a class="btn btn--red" href="${b}connect.html">Work With Me <i class="ri-arrow-right-up-line"></i></a><a class="btn btn--ghost" href="${b}services.html">My Services</a></div>
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="container">
    ${sectionHead("My Journey", `Milestones Over the <span class="text-red">Years</span>`)}
    <div class="timeline">
      ${[["2013", "Started in Digital Marketing", "Began with SEO and social media management for small businesses in Karachi."], ["2015", "Performance Marketing", "Expanded into Google Ads and Facebook Ads, managing campaigns for growing brands."], ["2018", "Graphic Design & Branding", "Built an in-house design workflow so strategy and creatives stay perfectly aligned."], ["2021", "E-commerce Growth", "Helped Pakistani online stores scale with Meta, Google Shopping and WhatsApp funnels."], ["2024", "Data & Automation", "Advanced tracking, GA4, Conversions API and automation for smarter decisions."], ["Today", `${site.years}+ Years Strong`, "Trusted by hundreds of businesses across Karachi, Pakistan and abroad."]]
        .map(([y, t, d]) => `<div class="tl reveal"><span class="tl__year">${y}</span><div class="tl__card glass"><h3>${t}</h3><p>${d}</p></div></div>`).join("")}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${sectionHead("My Values", `What I <span class="text-red">Stand</span> For`)}
    <div class="values">
      ${[["ri-eye-line", "Transparency", "You always know where your budget goes and what it returns."], ["ri-focus-3-line", "Results First", "Leads, sales and ROI — not vanity metrics."], ["ri-lightbulb-flash-line", "Creativity", "Bold ideas that make your brand stand out in a crowded market."], ["ri-team-line", "Partnership", "I treat your business like my own and grow with you long-term."]]
        .map(([ic, t, d]) => `<div class="value glass reveal"><i class="${ic}"></i><h3>${t}</h3><p>${d}</p></div>`).join("")}
    </div>
  </div>
</section>
<section class="section section--dark section--tight">
  <div class="container stats">
    ${[["13", "+", "Years of Experience", "ri-award-line"], ["500", "+", "Projects Delivered", "ri-rocket-2-line"], ["250", "+", "Happy Clients", "ri-emotion-happy-line"], ["20", "+", "Industries Served", "ri-building-4-line"]]
      .map(([n, s, l, ic]) => `<div class="stat reveal"><i class="${ic}"></i><strong><span data-count="${n}">0</span>${s}</strong><span>${l}</span></div>`).join("")}
  </div>
</section>
${ctaBand(b)}`,
});

// =====================================================================
// SERVICES OVERVIEW
// =====================================================================
page({
  path: "services.html",
  active: "services",
  title: "Digital Marketing, Graphic Design & Performance Marketing Services in Karachi",
  description: "Complete digital marketing services in Karachi: SEO, Local SEO, social media, Google Ads, Meta Ads, TikTok Ads, branding, logo design and more by Zeeshan Hussain Bhatti.",
  schema: [businessSchema, crumbSchema([["Home", ""], ["Services", "services.html"]])],
  body: (b) => `
${pageHero({ b, eyebrow: "Services", title: `Everything You Need to <span class="text-red">Grow Online</span>`, text: "Digital marketing, graphic design and performance marketing — planned and delivered by one experienced expert in Karachi.", crumbs: [["Services"]] })}
${categories
  .map(
    (c, ci) => `
<section class="section${ci % 2 ? " section--dark" : ""}" id="${c.key}">
  <div class="container">
    <div class="section-head section-head--split reveal">
      <div><span class="eyebrow"><i class="${c.icon}"></i> 0${ci + 1} — ${c.name}</span><h2>${c.name} <span class="text-red">Services</span></h2></div>
      <p>${c.blurb}</p>
    </div>
    <div class="svc-grid">
      ${c.services
        .map(
          (s, i) => `
      <a class="svc tilt reveal" href="${b}services/${s.slug}.html" style="--d:${(i % 3) * 0.08}s">
        <div class="svc__icon"><i class="${s.icon}"></i></div>
        <h3>${s.title}</h3>
        <p>${s.tagline}</p>
        <span class="link-arrow">Learn more <i class="ri-arrow-right-line"></i></span>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>`
  )
  .join("")}
${ctaBand(b)}`,
});

// =====================================================================
// INDIVIDUAL SERVICE PAGES
// =====================================================================
for (const s of allServices) {
  const svcFaqs = [
    [`How much does ${s.title} cost in Karachi?`, `Pricing depends on your goals, competition and scope. After a free consultation I'll share a clear proposal for ${s.title.toLowerCase()} with fixed deliverables — no hidden charges.`],
    [`How soon will I see results from ${s.title}?`, `You'll see early improvements within the first few weeks, with stronger, compounding results over 2–6 months depending on your industry and competition in Karachi.`],
    [`Do you provide reports?`, `Yes. You get a clear monthly report (and weekly updates for paid campaigns) showing exactly what was done and what it achieved.`],
    [`Can you work with businesses outside Karachi?`, `Absolutely. I'm based in Karachi but provide ${s.title.toLowerCase()} to clients across Pakistan, the UAE, the UK and beyond.`],
  ];
  const related = s.cat.services.filter((x) => x.slug !== s.slug).slice(0, 3);
  page({
    path: `services/${s.slug}.html`,
    active: "services",
    title: `${s.title} in Karachi | ${site.name}`,
    description: `${s.title} in Karachi by ${site.name}. ${s.desc}`.slice(0, 158),
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${s.title} in Karachi`,
        serviceType: s.title,
        description: s.desc,
        areaServed: { "@type": "City", name: "Karachi" },
        provider: { "@type": "ProfessionalService", name: businessSchema.name, telephone: site.phone, address: businessSchema.address },
      },
      faqSchema(svcFaqs),
      crumbSchema([["Home", ""], ["Services", "services.html"], [s.title, `services/${s.slug}.html`]]),
    ],
    body: (b) => `
${pageHero({ b, eyebrow: `<i class="${s.cat.icon}"></i> ${s.cat.name}`, title: `${s.title} in <span class="text-red">Karachi</span>`, text: s.tagline, crumbs: [["Services", "services.html"], [s.title]] })}
<section class="section">
  <div class="container split">
    <div class="split__content reveal">
      <span class="eyebrow">Overview</span>
      <h2>Expert ${s.title} for Karachi Businesses</h2>
      <p class="lead">${s.desc}</p>
      <p>With ${site.years}+ years in digital marketing, I combine strategy, execution and reporting into one clear service. You work directly with me — and every action is tied to a measurable business goal: more leads, more calls and more sales from customers in Karachi and beyond.</p>
      <div class="btn-row"><a class="btn btn--red" href="${b}connect.html">Get a Free Quote <i class="ri-arrow-right-up-line"></i></a><a class="btn btn--ghost" href="${waLink(`Hi Zeeshan, I'm interested in ${s.title}.`)}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i> WhatsApp</a></div>
    </div>
    <div class="split__media reveal"><div class="svc-visual glass"><div class="svc-visual__icon"><i class="${s.icon}"></i></div>${ph(s.title + " — service image", "4/3")}</div></div>
  </div>
</section>
<section class="section section--dark">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead("What's Included", `My ${s.title} <span class="text-red">Deliverables</span>`)}
    <div class="feature-grid">
      ${s.features.map((f, i) => `<div class="feature glass reveal" style="--d:${(i % 3) * 0.08}s"><span class="feature__n">0${i + 1}</span><i class="ri-checkbox-circle-line"></i><h3>${f}</h3></div>`).join("")}
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${sectionHead("Process", `How We'll <span class="text-red">Work Together</span>`)}
    <div class="process">
      ${[["ri-search-line", "Audit", "Analyse your business, market and competitors."], ["ri-road-map-line", "Strategy", "A tailored plan with clear KPIs and timelines."], ["ri-rocket-line", "Execute", "Expert implementation with weekly progress."], ["ri-bar-chart-grouped-line", "Report & Scale", "Monthly reports and continuous optimization."]]
        .map(([ic, t, d], i) => `<div class="step reveal" style="--d:${i * 0.1}s"><div class="step__icon"><i class="${ic}"></i><span>0${i + 1}</span></div><h3>${t}</h3><p>${d}</p></div>`).join("")}
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="container split split--top">
    <div class="split__content reveal"><span class="eyebrow">FAQ</span><h2>${s.title} <span class="text-red">FAQs</span></h2><p class="lead">Still have questions? I'm a message away.</p></div>
    <div class="faqs reveal">${faqList(svcFaqs)}</div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${sectionHead("Related", `More ${s.cat.name} <span class="text-red">Services</span>`)}
    <div class="svc-grid">
      ${related.map((r) => `<a class="svc tilt reveal" href="${b}services/${r.slug}.html"><div class="svc__icon"><i class="${r.icon}"></i></div><h3>${r.title}</h3><p>${r.tagline}</p><span class="link-arrow">Learn more <i class="ri-arrow-right-line"></i></span></a>`).join("")}
    </div>
  </div>
</section>
${ctaBand(b)}`,
  });
}

// =====================================================================
// BLOG INDEX + POSTS
// =====================================================================
page({
  path: "blog.html",
  active: "blog",
  title: `Digital Marketing Blog | Tips for Karachi Businesses | ${site.name}`,
  description: "Practical SEO, Local SEO, Google Ads, Meta Ads, social media and branding tips for businesses in Karachi and Pakistan.",
  schema: [crumbSchema([["Home", ""], ["Blogs", "blog.html"]])],
  body: (b) => `
${pageHero({ b, eyebrow: "Blogs", title: `Insights to <span class="text-red">Grow</span> Your Business`, text: "Practical, no-fluff guides on SEO, ads and branding — written for business owners in Karachi and Pakistan.", crumbs: [["Blogs"]] })}
<section class="section">
  <div class="container">
    <div class="filters filters--center reveal" role="tablist" aria-label="Filter articles">
      <button class="filter is-active" data-filter="all">All</button>
      ${[...new Set(posts.map((p) => p.cat))].map((c) => `<button class="filter" data-filter="${esc(c)}">${c}</button>`).join("")}
    </div>
    <div class="posts posts--filter">${posts.map((p) => postCard(b, p).replace('<article class="post-card reveal">', `<article class="post-card reveal" data-cat="${esc(p.cat)}">`)).join("")}</div>
  </div>
</section>
${ctaBand(b)}`,
});

const renderBody = (blocks) =>
  blocks
    .map(([t, v]) =>
      t === "ul" || t === "ol" ? `<${t}>${v.map((li) => `<li>${li}</li>`).join("")}</${t}>` : `<${t}>${v}</${t}>`
    )
    .join("\n");

for (const p of posts) {
  const others = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  page({
    path: `blog/${p.slug}.html`,
    active: "blog",
    title: `${p.title} | ${site.name}`,
    description: p.excerpt,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        author: { "@type": "Person", name: site.name },
        publisher: { "@type": "Person", name: site.name },
        mainEntityOfPage: `${site.url}/blog/${p.slug}.html`,
      },
      crumbSchema([["Home", ""], ["Blogs", "blog.html"], [p.title, `blog/${p.slug}.html`]]),
    ],
    body: (b) => `
${pageHero({ b, eyebrow: p.cat, title: p.title, text: `<span class="meta-inline"><i class="ri-user-3-line"></i> ${site.name} · <i class="ri-calendar-line"></i> ${fmtDate(p.date)} · <i class="ri-time-line"></i> ${p.read} min read</span>`, crumbs: [["Blogs", "blog.html"], [p.cat]] })}
<section class="section">
  <div class="container article-wrap">
    <article class="article reveal">
      ${ph(p.title + " — featured image", "16/8")}
      <div class="prose">${renderBody(p.body)}</div>
      <div class="share"><span>Share:</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${site.url}/blog/${p.slug}.html`)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><i class="ri-facebook-fill"></i></a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/blog/${p.slug}.html`)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><i class="ri-linkedin-fill"></i></a>
        <a href="https://wa.me/?text=${encodeURIComponent(`${p.title} ${site.url}/blog/${p.slug}.html`)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><i class="ri-whatsapp-line"></i></a>
      </div>
      <div class="author glass">
        <div class="author__ph"><i class="ri-user-3-line"></i></div>
        <div><strong>${site.name}</strong><p>Digital marketing expert in Karachi with ${site.years}+ years of experience in SEO, performance marketing and branding.</p><a class="link-arrow" href="${b}about.html">About me <i class="ri-arrow-right-line"></i></a></div>
      </div>
    </article>
    <aside class="sidebar">
      <div class="side-card glass reveal">
        <h3>Need help growing?</h3>
        <p>Get a free audit of your website, Google profile and ads.</p>
        <a class="btn btn--red btn--block" href="${b}connect.html">Free Audit <i class="ri-arrow-right-up-line"></i></a>
      </div>
      <div class="side-card glass reveal">
        <h3>Popular Services</h3>
        <ul class="side-links">${allServices.filter((x) => ["local-seo-karachi", "seo-services-karachi", "google-ads-ppc", "meta-ads-facebook-instagram", "logo-brand-identity"].includes(x.slug)).map((x) => `<li><a href="${b}services/${x.slug}.html"><i class="${x.icon}"></i>${x.title}</a></li>`).join("")}</ul>
      </div>
    </aside>
  </div>
</section>
<section class="section section--dark">
  <div class="container">
    ${sectionHead("Keep Reading", `Related <span class="text-red">Articles</span>`)}
    <div class="posts">${others.map((o) => postCard(b, o)).join("")}</div>
  </div>
</section>`,
  });
}

// =====================================================================
// CONNECT
// =====================================================================
page({
  path: "connect.html",
  active: "connect",
  title: `Contact ${site.name} | Digital Marketing Expert Karachi`,
  description: `Contact ${site.name}, digital marketing expert in Karachi. Call or WhatsApp ${site.phone} for a free consultation on SEO, Google Ads, Meta Ads and branding.`,
  schema: [businessSchema, crumbSchema([["Home", ""], ["Connect", "connect.html"]])],
  body: (b) => `
${pageHero({ b, eyebrow: "Connect", title: `Let's Start a <span class="text-red">Conversation</span>`, text: "Free 30-minute strategy call for Karachi businesses. Tell me where you are — I'll show you where you could be.", crumbs: [["Connect"]] })}
<section class="section">
  <div class="container">
    <div class="contact-cards">
      ${[["ri-phone-line", "Call Me", site.phone, `tel:+${site.phoneRaw}`], ["ri-whatsapp-line", "WhatsApp", "Chat instantly", waLink()], ["ri-mail-line", "Email", site.email, `mailto:${site.email}`], ["ri-map-pin-line", "Visit", "Karachi, Pakistan", "#map"]]
        .map(([ic, t, v, h], i) => `<a class="ccard glass tilt reveal" href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""} style="--d:${i * 0.08}s"><i class="${ic}"></i><h3>${t}</h3><span>${v}</span></a>`).join("")}
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="container split split--top">
    <div class="split__content reveal">
      <span class="eyebrow">Free Consultation</span>
      <h2>Tell Me About Your <span class="text-red">Business</span></h2>
      <p class="lead">Fill in the form and it opens WhatsApp with your details ready to send. I personally reply within a few hours during business hours.</p>
      <ul class="checks">
        <li><i class="ri-checkbox-circle-fill"></i>Free website &amp; Google profile audit</li>
        <li><i class="ri-checkbox-circle-fill"></i>Competitor analysis for your area</li>
        <li><i class="ri-checkbox-circle-fill"></i>Custom budget recommendation</li>
        <li><i class="ri-checkbox-circle-fill"></i>No obligation, no pressure</li>
      </ul>
      <p class="muted"><i class="ri-time-line"></i> ${site.hours}</p>
    </div>
    <div class="reveal">${contactForm(b)}</div>
  </div>
</section>
<section class="section" id="map">
  <div class="container">
    <div class="map-card map-card--wide reveal">
      <iframe title="Office location map" src="https://maps.google.com/maps?q=Shahrah-e-Faisal%20Karachi&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="map-card__info glass"><i class="ri-map-pin-2-fill"></i><div><strong>${site.name}</strong><small>${site.address}</small></div></div>
    </div>
  </div>
</section>`,
});

// =====================================================================
// 404, sitemap, robots
// =====================================================================
page({
  path: "404.html",
  active: "",
  title: `Page Not Found | ${site.name}`,
  description: "The page you are looking for could not be found.",
  body: (b) => `
<section class="hero hero--404">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="container center">
    <div class="big-404">4<span>0</span>4</div>
    <h1>This page went offline.</h1>
    <p class="lead">But your growth doesn't have to. Let's get you back on track.</p>
    <div class="btn-row btn-row--center"><a class="btn btn--red" href="${b}index.html">Back to Home</a><a class="btn btn--ghost" href="${b}services.html">View Services</a></div>
  </div>
</section>`,
});

const urls = written.filter((p) => p !== "404.html");
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.url}/${u === "index.html" ? "" : u}</loc><priority>${u === "index.html" ? "1.0" : u.includes("/") ? "0.7" : "0.9"}</priority></url>`).join("\n")}
</urlset>
`
);
out("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${written.length} files:\n  ` + written.join("\n  "));
