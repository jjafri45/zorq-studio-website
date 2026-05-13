import Lenis from "./vendor/lenis.mjs";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const progressBar = document.querySelector("[data-scroll-progress]");
const scrollTopButton = document.querySelector("[data-scroll-top]");

let lenis = null;

if (!reducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
  });

  window.zorqLenis = lenis;

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

const updateScrollUI = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? Math.min(1, scrollTop / scrollHeight) : 0;

  if (header) header.classList.toggle("is-scrolled", scrollTop > 16);
  if (progressBar) progressBar.style.width = `${progress * 100}%`;
  if (scrollTopButton) scrollTopButton.classList.toggle("is-visible", scrollTop > 400);
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });
if (lenis) lenis.on("scroll", updateScrollUI);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    if (lenis && !reducedMotion) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    if (lenis && !reducedMotion) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

const cursor = document.querySelector("[data-cursor]");

if (cursor && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    },
    { passive: true }
  );

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };

  cursor.classList.add("is-active");
  requestAnimationFrame(animateCursor);
}

const heroHeadline = document.querySelector('[data-page="home"] .hero-copy h1');

if (heroHeadline && !heroHeadline.dataset.animated) {
  heroHeadline.dataset.animated = "true";
  const words = heroHeadline.textContent.trim().split(/\s+/);
  heroHeadline.innerHTML = words.map((word) => `<span class="word">${word}</span>`).join(" ");

  if (!reducedMotion) {
    heroHeadline.querySelectorAll(".word").forEach((word, index) => {
      word.style.opacity = "0";
      word.style.transform = "translateY(20px)";
      word.style.transition = "opacity 600ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      word.style.transitionDelay = `${100 + index * 90}ms`;
    });

    requestAnimationFrame(() => {
      heroHeadline.querySelectorAll(".word").forEach((word) => {
        word.style.opacity = "1";
        word.style.transform = "translateY(0)";
      });
    });
  }
}

const revealNodes = document.querySelectorAll("[data-reveal]");
const staggerNodes = document.querySelectorAll("[data-reveal-stagger]");

if (!reducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          [...entry.target.children].forEach((child, index) => {
            child.style.transitionDelay = `${index * 70}ms`;
          });
          entry.target.classList.add("is-visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
  staggerNodes.forEach((node) => staggerObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
  staggerNodes.forEach((node) => {
    node.classList.add("is-visible");
    [...node.children].forEach((child) => {
      child.style.opacity = "1";
      child.style.transform = "none";
    });
  });
}

document.querySelectorAll("[data-stats]").forEach((stats) => {
  const counters = [...stats.querySelectorAll("[data-count]")];

  const setFinal = () => {
    counters.forEach((counter) => {
      const suffix = counter.dataset.suffix === "x" ? "x" : counter.dataset.suffix || "";
      counter.textContent = `${counter.dataset.count}${suffix}`;
    });
  };

  if (reducedMotion || !("IntersectionObserver" in window)) {
    setFinal();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || stats.dataset.counted) return;
        stats.dataset.counted = "true";
        const start = performance.now();
        const duration = 1000;

        const tick = (time) => {
          const progress = Math.min(1, (time - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          counters.forEach((counter) => {
            const target = Number(counter.dataset.count);
            const suffix = counter.dataset.suffix === "x" ? "x" : counter.dataset.suffix || "";
            counter.textContent = `${Math.round(target * eased)}${suffix}`;
          });
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(stats);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(stats);
});

document.querySelectorAll("[data-testimonial-marquee] .testimonial-track").forEach((track) => {
  track.append(...[...track.children].map((child) => child.cloneNode(true)));
});

document.querySelectorAll("[data-contact-form], [data-newsletter]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Signal received. We will respond with a clear next move.";
    form.reset();
  });
});

const processOrbit = document.querySelector("[data-orbit-process]");

if (processOrbit) {
  const steps = [
    { num: "01", name: "Discover", desc: "Map the brand, audience, market signals, and operational constraints before design begins." },
    { num: "02", name: "Define", desc: "Turn the signal into positioning, hierarchy, creative principles, and a focused system brief." },
    { num: "03", name: "Design", desc: "Build the visual universe: identity, interface, content, motion language, and launch assets." },
    { num: "04", name: "Build", desc: "Ship responsive, accessible, performance-aware web experiences with clean production structure." },
    { num: "05", name: "Automate", desc: "Connect repeatable creative workflows to AI systems that generate, test, and optimize." },
    { num: "06", name: "Scale", desc: "Measure performance, refine the ecosystem, and compound the work into a durable growth engine." }
  ];

  const nodes = [...processOrbit.querySelectorAll("[data-process-node]")];
  const detail = processOrbit.querySelector("[data-process-detail]");
  const detailNum = detail?.querySelector(".process-detail-num");
  const detailTitle = detail?.querySelector(".process-detail-title");
  const detailCopy = detail?.querySelector(".process-detail-copy");
  const traveller = processOrbit.querySelector("[data-orbit-traveller]");
  const motion = processOrbit.querySelector("[data-orbit-motion]");
  let activeIndex = 0;
  let cycleId = null;
  let manualSelection = false;

  const setActiveStep = (index) => {
    activeIndex = index;
    nodes.forEach((node, nodeIndex) => {
      const active = nodeIndex === index;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
      const dot = node.querySelector(".process-node-dot");
      if (dot) dot.setAttribute("r", active ? "9" : "6");
    });

    if (!detail || !detailNum || !detailTitle || !detailCopy) return;
    detail.classList.add("is-changing");
    window.setTimeout(() => {
      const step = steps[index];
      detailNum.textContent = step.num;
      detailTitle.textContent = step.name;
      detailCopy.textContent = step.desc;
      detail.classList.remove("is-changing");
    }, 150);
  };

  const stopCycle = () => {
    if (cycleId) {
      window.clearInterval(cycleId);
      cycleId = null;
    }
  };

  const handleManualSelection = (index) => {
    manualSelection = true;
    stopCycle();
    setActiveStep(index);
  };

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => handleManualSelection(index));
    node.addEventListener("focus", () => handleManualSelection(index));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleManualSelection(index);
      }
    });
  });

  setActiveStep(0);

  if (reducedMotion) {
    if (motion) motion.remove();
    if (traveller) traveller.remove();
  } else {
    cycleId = window.setInterval(() => {
      if (manualSelection) return;
      setActiveStep((activeIndex + 1) % steps.length);
    }, 3000);
  }
}

const canvas = document.querySelector("[data-cosmic]");

if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const points = Array.from({ length: 110 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.00008 + Math.random() * 0.00014;
    return {
      x: Math.random(),
      y: Math.random(),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 0.75 + Math.random() * 1.35
    };
  });

  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    },
    { passive: true }
  );

  const drawGlow = (x, y, radius, opacity) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(0, 200, 83, ${opacity})`);
    gradient.addColorStop(0.46, `rgba(157, 78, 221, ${opacity * 0.5})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const draw = () => {
    const pulse = 0.055 + Math.sin(Date.now() * 0.0008) * 0.025;
    const parallaxX = (mouse.x - width / 2) * 0.008;
    const parallaxY = (mouse.y - height / 2) * 0.008;

    ctx.clearRect(0, 0, width, height);
    drawGlow(width * 0.24, height * 0.22, width * 0.42, pulse);
    drawGlow(width * 0.78, height * 0.55, width * 0.5, 0.11 - pulse);

    const positions = points.map((point) => {
      point.x = (point.x + point.vx + 1) % 1;
      point.y = (point.y + point.vy + 1) % 1;
      return {
        x: point.x * width + parallaxX,
        y: point.y * height + parallaxY,
        size: point.size
      };
    });

    ctx.strokeStyle = "rgba(0, 200, 83, 0.06)";
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance <= 160) {
          ctx.globalAlpha = 1 - distance / 160;
          ctx.beginPath();
          ctx.moveTo(positions[i].x, positions[i].y);
          ctx.lineTo(positions[j].x, positions[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    positions.forEach((point) => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.48)";
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
}
