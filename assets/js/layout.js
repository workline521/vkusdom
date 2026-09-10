document.addEventListener("DOMContentLoaded", () => {
  // открытие и закрытие меню в мобильной версии
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  const body = document.querySelector("body");
  if (!burger || !menu) return;
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("active");
    body.classList.toggle("overflow");
    const isOpen = burger.classList.contains("active");
    burger.setAttribute("aria-expanded", isOpen);
  });

  //slider
  new Swiper(".slider__brand", {
    slidesPerView: "auto",
    spaceBetween: 8, 
    freeMode: false,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        spaceBetween: 10, 
      },
    },
  });

  //слайдер с ссылками в хэдере
  const select = document.querySelector(".header__select");
  if (!select) return;

  const links = select.querySelector(".header__links");
  const left = select.querySelector(".header__left");
  const right = select.querySelector(".header__right");

  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

  const scrollBySlide = (dir) => {
    if (!isDesktop()) return;

    const items = [...links.querySelectorAll(".header__link")];
    const current = links.scrollLeft;

    if (dir > 0) {
      for (const el of items) {
        const start = el.offsetLeft - links.offsetLeft;
        if (start > current + 1) {
          links.scrollTo({ left: start, behavior: "smooth" });
          return;
        }
      }
      links.scrollTo({ left: links.scrollWidth, behavior: "smooth" });
    } else {
      for (let i = items.length - 1; i >= 0; i--) {
        const start = items[i].offsetLeft - links.offsetLeft;
        if (start < current - 1) {
          links.scrollTo({ left: start, behavior: "smooth" });
          return;
        }
      }
      links.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  left.addEventListener("click", () => scrollBySlide(-1));
  right.addEventListener("click", () => scrollBySlide(1));
  const updateButtons = () => {
    if (!isDesktop()) {
      left.disabled = true;
      right.disabled = true;
      return;
    }
    const max = links.scrollWidth - links.clientWidth;
    left.disabled = links.scrollLeft <= 0;
    right.disabled = links.scrollLeft >= max - 1;
  };
  links.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  links.addEventListener("mousedown", (e) => {
    if (!isDesktop()) return;
    isDown = true;
    moved = false;
    startX = e.pageX;
    startScroll = links.scrollLeft;
    links.classList.add("is-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 3) moved = true;
    links.scrollLeft = startScroll - dx;
  });

  document.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    links.classList.remove("is-dragging");
  });
  links.addEventListener(
    "click",
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
});