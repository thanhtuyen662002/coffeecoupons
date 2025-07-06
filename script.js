function setupCarousel(carouselElement) {
  const items = carouselElement.querySelectorAll(".carousel-item");
  let current = 0;
  const total = items.length;

  function updateCarousel() {
    items.forEach((item, index) => {
      item.classList.remove("active", "prev", "next", "prev-prev", "next-next");
      item.style.setProperty("--direction", "0");
    });

    const getIndex = (offset) => (current + offset + total) % total;

    items[getIndex(0)].classList.add("active");
    items[getIndex(-1)].classList.add("prev");
    items[getIndex(1)].classList.add("next");
    items[getIndex(-2)].classList.add("prev-prev");
    items[getIndex(2)].classList.add("next-next");

    items[getIndex(-1)].style.setProperty("--direction", -1);
    items[getIndex(-2)].style.setProperty("--direction", -1);
    items[getIndex(1)].style.setProperty("--direction", 1);
    items[getIndex(2)].style.setProperty("--direction", 1);
  }

  function nextSlide() {
    current = (current + 1) % total;
    updateCarousel();
  }

  updateCarousel();
  setInterval(nextSlide, 2000);
}

async function fetchAndReplaceImages(brand, carouselSelector) {
  const proxy = "https://scraper-api-production-ea0b.up.railway.app/api/";

  try {
    const res = await fetch(proxy + encodeURIComponent(brand));
    const data = await res.json();

    const imageUrls = data.images || [];

    const carousel = document.querySelector(carouselSelector);

    // Nếu chưa đủ ảnh, tạo thêm slide
    const currentItems = carousel.querySelectorAll(".carousel-item");
    const missingCount = imageUrls.length - currentItems.length;

    for (let i = 0; i < missingCount; i++) {
      const newItem = document.createElement("div");
      newItem.classList.add("carousel-item");
      newItem.innerHTML = '<img src="" alt="Coupon" />';
      carousel.appendChild(newItem);
    }

    const items = carousel.querySelectorAll(".carousel-item");

    imageUrls.slice(0, items.length).forEach((url, index) => {
      const img = items[index].querySelector("img");
      img.src = url;
    });

    setupCarousel(carousel); // khởi tạo lại carousel sau khi cập nhật ảnh
  } catch (error) {
    console.error("Lỗi khi tải ảnh:", error);
  }
}

function updateAllCarousels() {
  fetchAndReplaceImages("highlands", ".coupon-container a:nth-of-type(1) .carousel");
  fetchAndReplaceImages("thecoffeehouse", ".coupon-container a:nth-of-type(3) .carousel");
  fetchAndReplaceImages("kcoffee", ".coupon-container a:nth-of-type(4) .carousel");
  const highlandsZaloCarousel = document.querySelector(".coupon-container a:nth-of-type(2) .carousel");
  setupCarousel(highlandsZaloCarousel);
}

// Gọi hàm khi trang đã load
window.addEventListener("DOMContentLoaded", () => {
  updateAllCarousels();
});

function runAtMidnight(callback) {
  const now = new Date();
  const nextMidnight = new Date();

  nextMidnight.setHours(3, 0, 0, 0); // 0h sáng ngày hôm sau
  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  // Đợi tới 0h để chạy lần đầu
  setTimeout(() => {
    callback(); // Chạy cập nhật
    setInterval(callback, 24 * 60 * 60 * 1000); // Cứ mỗi 24h lặp lại
  }, msUntilMidnight);
}

// Đặt hàm cập nhật ảnh vào lúc 12h đêm
runAtMidnight(() => {
  updateAllCarousels();
});