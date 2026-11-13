(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-carousel-track]");
  const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  const status = root.querySelector("[data-carousel-status]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let locked = false;

  const dots = slides.map((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "carousel__dot";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", `Ir al jurado ${i + 1}`);
    btn.addEventListener("click", () => goTo(i, i > index ? 1 : -1));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function updateUi(direction) {
    track.style.setProperty("--carousel-index", String(index));
    track.dataset.direction = direction >= 0 ? "next" : "prev";

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
      dot.tabIndex = active ? 0 : -1;
    });

    if (status) {
      status.textContent = `${index + 1} / ${slides.length}`;
    }
  }

  function goTo(nextIndex, direction = 1) {
    if (locked || nextIndex === index) return;
    const total = slides.length;
    index = ((nextIndex % total) + total) % total;
    locked = !reduceMotion;

    updateUi(direction);

    if (locked) {
      window.setTimeout(() => {
        locked = false;
      }, 620);
    }
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1, -1));
  nextBtn?.addEventListener("click", () => goTo(index + 1, 1));

  updateUi(1);
})();
