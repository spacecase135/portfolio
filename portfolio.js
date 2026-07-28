const menuButton = document.getElementById("menu-button");
const siteMenu = document.getElementById("site-menu");
const galleryItems = [...document.querySelectorAll("[data-lightbox]")];
const lightbox = document.getElementById("lightbox");
let currentIndex = 0;
let lastOpener = null;

function setMenu(open) {
  siteMenu.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close portfolio navigation" : "Open portfolio navigation");
  document.body.classList.toggle("menu-open", open);
  if (open) siteMenu.querySelector("a[aria-current='page']")?.focus();
}
menuButton.addEventListener("click", () => setMenu(!siteMenu.classList.contains("open")));
siteMenu.addEventListener("click", event => { if (event.target.closest("a")) setMenu(false); });

function showImage(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  const image = document.getElementById("lightbox-image");
  image.src = item.dataset.lightbox;
  image.alt = item.dataset.alt || item.querySelector("img")?.alt || "";
  document.querySelector(".lightbox-count").textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
}
function openLightbox(index, opener) {
  lastOpener = opener;
  showImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightbox.querySelector(".lightbox-close").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  document.getElementById("lightbox-image").src = "";
  lastOpener?.focus();
}
galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index, item)));
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentIndex + 1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox || event.target.classList.contains("lightbox-stage")) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("open")) closeLightbox();
    else setMenu(false);
  }
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "ArrowLeft") showImage(currentIndex - 1);
  if (event.key === "ArrowRight") showImage(currentIndex + 1);
  if (event.key === "Tab") {
    const controls = [...lightbox.querySelectorAll("button")];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
