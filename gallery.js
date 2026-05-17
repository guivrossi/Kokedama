(function () {
  const GALLERY_BASE = "gallery/";
  const grid = document.getElementById("gallery-grid");
  const emptyEl = document.getElementById("gallery-empty");
  const lightbox = document.getElementById("lightbox");

  if (!grid) return;

  function photoSrc(file) {
    if (/^https?:\/\//i.test(file)) return file;
    return GALLERY_BASE + file.replace(/^\//, "");
  }

  function renderPhotos(photos) {
    grid.innerHTML = "";

    if (!photos || photos.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    photos.forEach((photo, index) => {
      const src = photoSrc(photo.file);
      const caption = photo.caption || "";
      const item = document.createElement("button");
      item.type = "button";
      item.className = "gallery-item";
      item.setAttribute("data-index", String(index));
      item.innerHTML = `
        <img src="${src}" alt="${escapeHtml(caption)}" loading="lazy" width="400" height="400" />
        ${caption ? `<span class="gallery-caption">${escapeHtml(caption)}</span>` : ""}
      `;
      item.addEventListener("click", () => openLightbox(photos, index));
      grid.appendChild(item);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openLightbox(photos, index) {
    if (!lightbox) return;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightbox.dataset.index = String(index);
    updateLightbox(photos, index);

    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");

    closeBtn.onclick = closeLightbox;
    prevBtn.onclick = () => navigate(photos, -1);
    nextBtn.onclick = () => navigate(photos, 1);
    lightbox.querySelector(".lightbox-backdrop").onclick = closeLightbox;

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(photos, -1);
      if (e.key === "ArrowRight") navigate(photos, 1);
    };
    lightbox._onKey = onKey;
    document.addEventListener("keydown", onKey);
  }

  function navigate(photos, delta) {
    let i = Number(lightbox.dataset.index) + delta;
    if (i < 0) i = photos.length - 1;
    if (i >= photos.length) i = 0;
    lightbox.dataset.index = String(i);
    updateLightbox(photos, i);
  }

  function updateLightbox(photos, index) {
    const photo = photos[index];
    const img = lightbox.querySelector(".lightbox-img");
    const cap = lightbox.querySelector(".lightbox-caption");
    const counter = lightbox.querySelector(".lightbox-counter");
    img.src = photoSrc(photo.file);
    img.alt = photo.caption || "";
    cap.textContent = photo.caption || "";
    cap.hidden = !photo.caption;
    counter.textContent = `${index + 1} / ${photos.length}`;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lightbox._onKey) {
      document.removeEventListener("keydown", lightbox._onKey);
      lightbox._onKey = null;
    }
  }

  fetch(GALLERY_BASE + "gallery.json")
    .then((res) => {
      if (!res.ok) throw new Error("gallery.json not found");
      return res.json();
    })
    .then((data) => renderPhotos(data.photos))
    .catch(() => {
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent =
          "Em breve, novas fotos por aqui. Enquanto isso, fale conosco no WhatsApp e veja o que está em produção.";
      }
    });
})();
