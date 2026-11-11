/* =========================================================
   Zeeshan Hussain Bhatti — site interactions
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const pre = $(".preloader");
  const hidePre = () => pre && pre.classList.add("is-done");
  window.addEventListener("load", () => setTimeout(hidePre, 300));
  setTimeout(hidePre, 2500); // safety net

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Header / progress / back to top ---------- */
  const header = $(".header");
  const progress = $(".scroll-progress");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    toTop && toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  /* ---------- Mega menu (touch / keyboard support) ---------- */
  $$(".has-mega").forEach((li) => {
    const link = li.querySelector(":scope > a");
    const setOpen = (open) => { li.classList.toggle("is-open", open); link.setAttribute("aria-expanded", String(open)); };
    li.addEventListener("mouseenter", () => link.setAttribute("aria-expanded", "true"));
    li.addEventListener("mouseleave", () => setOpen(false));
    // On touch devices first tap opens the menu instead of navigating
    link.addEventListener("click", (e) => {
      if (window.matchMedia("(hover: none)").matches && !li.classList.contains("is-open")) { e.preventDefault(); setOpen(true); }
    });
    document.addEventListener("click", (e) => { if (!li.contains(e.target)) setOpen(false); });
    li.addEventListener("keydown", (e) => { if (e.key === "Escape") { setOpen(false); link.blur(); } });
  });

  /* ---------- Mobile services bottom sheet ---------- */
  const sheet = $("#services-sheet");
  const openSheet = (open) => {
    if (!sheet) return;
    sheet.classList.toggle("is-open", open);
    sheet.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  };
  $$("[data-open-sheet]").forEach((b) => b.addEventListener("click", () => openSheet(!sheet.classList.contains("is-open"))));
  $$("[data-close-sheet]").forEach((b) => b.addEventListener("click", () => openSheet(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && openSheet(false));
  // swipe down to close
  if (sheet) {
    const panel = $(".sheet__panel", sheet);
    let startY = null;
    panel.addEventListener("touchstart", (e) => { if ($(".sheet__body", sheet).scrollTop <= 0) startY = e.touches[0].clientY; }, { passive: true });
    panel.addEventListener("touchmove", (e) => {
      if (startY === null) return;
      const d = e.touches[0].clientY - startY;
      if (d > 0) panel.style.transform = `translateY(${d}px)`;
    }, { passive: true });
    panel.addEventListener("touchend", (e) => {
      if (startY === null) return;
      const d = e.changedTouches[0].clientY - startY;
      panel.style.transform = "";
      if (d > 90) openSheet(false);
      startY = null;
    });
  }

  /* ---------- Hero slider ---------- */
  const hero = $(".hero");
  const slides = hero ? $$(".slide", hero) : [];
  if (slides.length > 1) {
    const dots = $$(".dot", hero);
    const TIME = 6500;
    hero.style.setProperty("--slide-time", TIME + "ms");
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
      dots.forEach((d, k) => {
        d.classList.toggle("is-active", k === i);
        d.setAttribute("aria-selected", String(k === i));
        // restart progress animation
        const bar = d.firstElementChild; bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
      });
      restart();
    };
    const restart = () => { clearTimeout(timer); if (!reduce && !hero.classList.contains("is-paused")) timer = setTimeout(() => go(i + 1), TIME); };
    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.slide)));
    $("[data-next]", hero).addEventListener("click", () => go(i + 1));
    $("[data-prev]", hero).addEventListener("click", () => go(i - 1));
    hero.addEventListener("mouseenter", () => { hero.classList.add("is-paused"); clearTimeout(timer); });
    hero.addEventListener("mouseleave", () => { hero.classList.remove("is-paused"); go(i); });
    // swipe
    let sx = null;
    hero.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    hero.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      sx = null;
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? clearTimeout(timer) : restart()));
    go(0);
  }

  /* ---------- Typed words ---------- */
  $$(".typed").forEach((el) => {
    const words = (el.dataset.words || "").split("|");
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c < word.length) c++;
      else if (del && c > 0) c--;
      else if (!del) { del = true; return setTimeout(tick, 1600); }
      else { del = false; w = (w + 1) % words.length; }
      setTimeout(tick, del ? 45 : 85);
    };
    tick();
  });

  /* ---------- Reveal on scroll + counters ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduce) { el.textContent = end.toLocaleString(); return; }
    const dur = 1800, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  $$(".dash__chart span").forEach((s, k) => s.style.setProperty("--i", k));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
    $$("[data-count]").forEach(countUp);
  }

  /* ---------- Filters (portfolio + blog) ---------- */
  $$(".filters").forEach((group) => {
    const scope = group.closest(".section") || document;
    const items = $$("[data-cat]", scope);
    $$(".filter", group).forEach((btn) =>
      btn.addEventListener("click", () => {
        $$(".filter", group).forEach((b) => b.classList.toggle("is-active", b === btn));
        const f = btn.dataset.filter;
        items.forEach((it) => {
          const show = f === "all" || it.dataset.cat === f;
          it.classList.toggle("is-hidden", !show);
          if (show) { it.classList.remove("is-in"); requestAnimationFrame(() => it.classList.add("is-in")); }
        });
      })
    );
  });

  /* ---------- Pricing: monthly / quarterly toggle ---------- */
  const billing = $(".billing");
  if (billing) {
    const plans = $(".plans");
    const off = +plans.dataset.discount || 0;
    const opts = $$(".billing__opt", billing);
    const place = (btn) => {
      billing.style.setProperty("--pw", btn.offsetWidth + "px");
      billing.style.setProperty("--px", btn.offsetLeft - 5 + "px");
    };
    const fmt = (n) => n.toLocaleString("en-US");
    const setBilling = (btn) => {
      const q = btn.dataset.billing === "quarterly";
      opts.forEach((o) => { o.classList.toggle("is-active", o === btn); o.setAttribute("aria-checked", String(o === btn)); });
      place(btn);
      $$("[data-price]", plans).forEach((el) => {
        const base = +el.dataset.price;
        const val = q ? Math.round((base * (100 - off)) / 100 / 500) * 500 : base;
        el.textContent = fmt(val);
        el.classList.remove("is-tick"); void el.offsetWidth; el.classList.add("is-tick");
        el.closest(".plan").querySelector("[data-bill]").innerHTML = q
          ? `Billed PKR ${fmt(val * 3)} every 3 months · <b>save PKR ${fmt((base - val) * 3)}</b>`
          : "Billed monthly · cancel anytime";
      });
      $$("[data-plan]", plans).forEach((a) => {
        const msg = `Hi Zeeshan, I'm interested in the ${a.dataset.plan} package (${q ? "quarterly" : "monthly"} billing).`;
        a.href = a.href.replace(/text=.*/, "text=" + encodeURIComponent(msg));
      });
    };
    opts.forEach((o) => o.addEventListener("click", () => setBilling(o)));
    place(opts[0]);
    window.addEventListener("resize", () => place($(".billing__opt.is-active", billing)));
  }

  /* ---------- "New SEO" game: animated roadmap ---------- */
  const sg = $("[data-sg]");
  if (sg) {
    const levels = $$(".sg__level", sg);
    const line = $(".sg__line", sg), player = $(".sg__player", sg), comet = $(".sg__comet", sg);
    const mobile = window.matchMedia("(max-width: 991px)");
    const len = mobile.matches ? 0 : line.getTotalLength();
    // path length at which each level card sits (closest point on the path)
    const stops = mobile.matches ? [] : levels.map((lv) => {
      const r = sg.getBoundingClientRect(), c = lv.getBoundingClientRect();
      const tx = ((c.left + c.width / 2 - r.left) / r.width) * 1200, ty = ((c.top + c.height / 2 - r.top) / r.height) * 660;
      let best = 0, bd = Infinity;
      for (let l = 0; l <= len; l += 4) { const pt = line.getPointAtLength(l), d = (pt.x - tx) ** 2 + (pt.y - ty) ** 2; if (d < bd) { bd = d; best = l; } }
      return best / len;
    });
    const light = (p) => levels.forEach((lv, i) => {
      const on = p >= (mobile.matches ? (i + 1) / (levels.length + 1) : stops[i]) - 0.002;
      if (on && !lv.classList.contains("is-on")) { lv.classList.add("is-on", "is-hit"); setTimeout(() => lv.classList.remove("is-hit"), 650); }
      if (!on) lv.classList.remove("is-on");
    });
    const draw = (p) => {
      if (!len) return;
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len * (1 - p);
      const pt = line.getPointAtLength(len * p);
      player.setAttribute("cx", pt.x); player.setAttribute("cy", pt.y);
      sg.style.setProperty("--p", p);
      light(p);
    };
    let started = false, cometRaf;
    const loopComet = () => {
      cancelAnimationFrame(cometRaf);
      const t0 = performance.now();
      const step = (t) => {
        const pt = line.getPointAtLength(len * (((t - t0) / 5000) % 1));
        comet.setAttribute("cx", pt.x); comet.setAttribute("cy", pt.y);
        cometRaf = requestAnimationFrame(step);
      };
      cometRaf = requestAnimationFrame(step);
    };
    const play = () => {
      if (started) return; started = true;
      if (reduce) { draw(1); sg.classList.add("is-done"); return; }
      sg.classList.add("is-playing");
      const DUR = 6500, t0 = performance.now();
      const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      const step = (t) => {
        const k = Math.min((t - t0) / DUR, 1);
        draw(ease(k));
        if (k < 1) requestAnimationFrame(step);
        else { sg.classList.remove("is-playing"); sg.classList.add("is-done"); loopComet(); }
      };
      requestAnimationFrame(step);
    };
    // Mobile: the timeline fills as you scroll. Desktop: plays once the board is in view.
    const onScroll = () => {
      if (!mobile.matches) return;
      const r = sg.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.65 - r.top) / r.height));
      sg.style.setProperty("--p", p); light(p);
      if (p >= 1) sg.classList.add("is-done");
    };
    draw(0);
    if (mobile.matches) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { play(); o.disconnect(); } }, { threshold: 0.35 }).observe(sg);
    } else play();
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(cometRaf); else if (sg.classList.contains("is-done") && !mobile.matches) loopComet(); });
  }

  /* ---------- Testimonials slider ---------- */
  const ts = $(".tslider");
  if (ts) {
    const by = (dir) => { const card = ts.firstElementChild; const w = card ? card.getBoundingClientRect().width + 24 : 300; ts.scrollBy({ left: dir * w, behavior: "smooth" }); };
    const next = $("[data-t-next]"), prev = $("[data-t-prev]");
    next && next.addEventListener("click", () => (ts.scrollLeft + ts.clientWidth >= ts.scrollWidth - 5 ? ts.scrollTo({ left: 0, behavior: "smooth" }) : by(1)));
    prev && prev.addEventListener("click", () => by(-1));
    if (!reduce) {
      let auto = setInterval(() => next && next.click(), 5000);
      ts.addEventListener("pointerenter", () => clearInterval(auto));
      ts.addEventListener("touchstart", () => clearInterval(auto), { passive: true });
    }
  }

  /* ---------- Tilt + spotlight on cards ---------- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-4px)`;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
    const glow = $(".cursor-glow");
    if (glow) window.addEventListener("mousemove", (e) => (glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`), { passive: true });
  }

  /* ---------- Contact form → WhatsApp ---------- */
  $$("#lead-form").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach((f) => { const bad = !f.value.trim(); f.classList.toggle("is-invalid", bad); if (bad) ok = false; });
      if (!ok) { $(".is-invalid", form).focus(); return; }
      const d = Object.fromEntries(new FormData(form).entries());
      const lines = [
        "Hi Zeeshan, I'd like a free consultation.",
        "",
        `*Name:* ${d.name}`,
        `*Phone:* ${d.phone}`,
        d.business && `*Business:* ${d.business}`,
        d.service && `*Service:* ${d.service}`,
        d.budget && `*Budget:* ${d.budget}`,
        d.message && `*Goals:* ${d.message}`,
      ].filter((l, k) => typeof l === "string" && (l !== "" || k === 1));
      window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
      form.reset();
    })
  );

  /* ---------- Hero network canvas (tech background) ---------- */
  const cv = $(".hero__net");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let W, H, pts, raf, visible = true;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const init = () => {
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.round(Math.min(70, (W * H) / 22000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let a = 0; a < pts.length; a++) {
        const p = pts[a];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (let b = a + 1; b < pts.length; b++) {
          const q = pts[b], dx = p.x - q.x, dy = p.y - q.y, dist = dx * dx + dy * dy;
          if (dist < 16000) { ctx.strokeStyle = `rgba(227,24,45,${0.18 * (1 - dist / 16000)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        ctx.fillStyle = a % 5 ? "rgba(255,255,255,.35)" : "rgba(255,59,79,.9)";
        ctx.beginPath(); ctx.arc(p.x, p.y, a % 5 ? 1.3 : 2, 0, Math.PI * 2); ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(draw);
    };
    init(); draw();
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(init, 200); });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; cancelAnimationFrame(raf); if (visible) draw(); }).observe(cv);
  }
})();
