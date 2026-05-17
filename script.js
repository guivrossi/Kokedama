(function () {
  const cfg = typeof KOKADAMA_CONFIG !== "undefined" ? KOKADAMA_CONFIG : {};
  const phone = cfg.whatsapp || "5511999999999";

  const brand = cfg.brandName || "Kokedama Nice & Lua";
  const defaultMessage = `Olá! Vi o site da ${brand} (Santo André) e gostaria de saber mais sobre as kokedamas. Pode me contar as opções?`;

  function buildWhatsAppUrl(message) {
    const text = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${text}`;
  }

  function messageForPackage(pkg) {
    if (!pkg) return defaultMessage;
    return `Olá! Vi o site da ${brand} e tenho interesse no pacote ${pkg}. Pode me enviar mais detalhes?`;
  }

  const igHandle = cfg.instagram || "suacontaaqui";
  document.querySelectorAll('a[href*="instagram.com"]').forEach((el) => {
    el.href = `https://instagram.com/${igHandle.replace("@", "")}`;
    el.textContent = `@${igHandle.replace("@", "")}`;
  });

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const pkg = el.getAttribute("data-package");
    const msg = messageForPackage(pkg);
    el.href = buildWhatsAppUrl(msg);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
