const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
}

document.querySelectorAll("[data-contact-form], [data-newsletter]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Signal received. We will respond with a clear next move.";
    form.reset();
  });
});

const canvas = document.querySelector("[data-cosmic]");

if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d", { alpha: true });
  const points = Array.from({ length: 70 }, (_, index) => ({
    x: (index * 97) % 1000,
    y: (index * 53) % 700,
    speed: 0.18 + (index % 5) * 0.035,
    size: 0.8 + (index % 4) * 0.35
  }));
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

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(0, 200, 83, 0.13)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    points.forEach((point, index) => {
      point.y -= point.speed;
      if (point.y < -20) point.y = height + 20;
      const x = (point.x / 1000) * width;
      const y = (point.y / 700) * height;
      ctx.beginPath();
      ctx.arc(x, y, point.size, 0, Math.PI * 2);
      ctx.fill();
      if (index % 6 === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(width * 0.62, height * 0.45);
        ctx.stroke();
      }
    });
    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
}
