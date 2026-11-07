# Zeeshan Hussain Bhatti — Digital Marketing Expert (Karachi)

A fast, mobile-first personal brand website in a black & red tech theme, built with plain **HTML, CSS and JavaScript**. No framework is needed to host it.

## Pages

| Page | File |
|---|---|
| Home (hero slider + all sections) | `index.html` |
| About Me | `about.html` |
| Services overview | `services.html` |
| 20 service pages (mega menu) | `services/*.html` |
| Blogs listing + 6 articles | `blog.html`, `blog/*.html` |
| Connect (contact) | `connect.html` |
| 404 | `404.html` |
| SEO | `sitemap.xml`, `robots.txt`, JSON-LD schema on every page |

**Home sections:** Hero slider (content on the left, photo on the right) → platform marquee → stats counters → About → 3 service pillars → 4-step process → Portfolio (filterable) → Case studies → Why choose me + live dashboard → Industries → Karachi areas + map → Skills & tools → Testimonials → FAQ → Blog → Contact form → CTA.

**Mobile:** a sticky, app-style bottom navigation (Home · Services · WhatsApp · Blogs · Connect). The Services button opens a bottom sheet that lists every service.

## How to edit

Shared content lives in **`src/data.mjs`**: phone, email, address, social links, services, blog posts, portfolio, Karachi areas and FAQs. After you edit it, rebuild every page:

```bash
node src/build.mjs
```

Page layouts and sections are in `src/build.mjs`. The header, mega menu, footer and mobile nav are in `src/layout.mjs`. Styles are in `assets/css/style.css` and interactions in `assets/js/main.js`.

> Edit the `src/` files and rebuild. Don't edit the generated `.html` files directly: the next build overwrites them.

## Before going live — checklist

1. **Contact details** in `src/data.mjs`: `url`, `phone`, `phoneRaw` (WhatsApp number, e.g. `923001234567`), `email`, `address`, `social`.
2. **Photos.** Every grey striped box is an image placeholder. Put your images in `assets/img/`. In `src/build.mjs`, replace the `ph("...")` call with an `<img>` tag, for example:
   ```js
   `<div class="ph ph--hero" style="aspect-ratio:4/5"><img src="assets/img/zeeshan-hero.jpg" alt="Zeeshan Hussain Bhatti - Digital Marketing Expert Karachi"></div>`
   ```
   (Use `${b}assets/img/...` so the path also works on pages inside the `services/` and `blog/` folders.)
3. **Numbers and claims.** Update the stats (13+ years, 500+ projects, 250+ clients, PKR 50M+), case-study results, portfolio results and certifications so they match your real work.
4. **Testimonials.** The current quotes are **samples** with "Client Name". Replace them with real client reviews.
5. **Map.** Change the Google Maps query (`Shahrah-e-Faisal Karachi`) to your exact office address.
6. Add `assets/img/og.jpg` (1200×630) for social sharing previews.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Credits

Icons: [Remix Icon](https://remixicon.com) (Apache 2.0), bundled in `assets/vendor/remixicon`. Fonts: Space Grotesk and Inter (Google Fonts).
