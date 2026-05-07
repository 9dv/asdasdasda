/* ==================================================
   Main JavaScript File:
   - Theme toggle (Dark / Light)
   - Cart counter
   - Menu filtering
   - Contact form validation
   - Scroll to top
   - Image lightbox
   - FAQ accordion
   - Accessibility enhancements
================================================== */

/* ==================================================
   0. REDUCED MOTION SUPPORT (ACCESSIBILITY)
================================================== */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.documentElement.classList.add("reduce-motion");
  }
})();

/* ==================================================
   1. DARK / LIGHT MODE TOGGLE (LOCAL STORAGE)
================================================== */
(function () {
  const storedTheme = localStorage.getItem("wingman-theme");
  if (storedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  toggleBtn.textContent =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "Light mode"
      : "Dark mode";

  toggleBtn.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("wingman-theme", "light");
      toggleBtn.textContent = "Dark mode";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("wingman-theme", "dark");
      toggleBtn.textContent = "Light mode";
    }
  });
})();

/* ==================================================
   2. CART COUNTER (LOCAL STORAGE + MICRO FEEDBACK)
================================================== */
(function () {
  const cartCountEl = document.getElementById("cartCount");
  let count = Number(localStorage.getItem("wingman-cart") || 0);

  if (cartCountEl) cartCountEl.textContent = count;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    e.preventDefault();
    count++;
    localStorage.setItem("wingman-cart", count);

    if (cartCountEl) {
      cartCountEl.textContent = count;
      cartCountEl.classList.add("pulse");
      setTimeout(() => cartCountEl.classList.remove("pulse"), 300);
    }

    const originalText = btn.textContent;
    btn.textContent = "Added ✓";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 900);
  });
})();

/* ==================================================
   3. MENU FILTER (DISPLAY: NONE REQUIREMENT)
================================================== */
(function () {
  if (document.body.dataset.page !== "menu") return;

  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".menu-item");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach((item) => {
        item.style.display =
          category === "all" || item.dataset.category === category
            ? "block"
            : "none";
      });
    });
  });
})();

/* ==================================================
   4. CONTACT FORM VALIDATION + SUCCESS MESSAGE
================================================== */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = form.querySelector("#name");
  const email = form.querySelector("#email");
  const message = form.querySelector("#message");
  const successMsg = document.getElementById("formSuccess");

  function showError(input, msg) {
    const group = input.closest(".form-group");
    input.style.borderColor = "red";
    group.querySelector(".error-message").textContent = msg;
  }

  function clearError(input) {
    const group = input.closest(".form-group");
    input.style.borderColor = "";
    group.querySelector(".error-message").textContent = "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    successMsg.style.display = "none";

    if (name.value.trim() === "") {
      showError(name, "Name is required");
      valid = false;
    } else clearError(name);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, "Valid email is required");
      valid = false;
    } else clearError(email);

    if (message.value.trim() === "") {
      showError(message, "Message cannot be empty");
      valid = false;
    } else clearError(message);

    if (valid) {
      form.reset();
      successMsg.textContent = "✅ Message sent successfully (demo).";
      successMsg.style.display = "block";
    }
  });
})();

/* ==================================================
   5. SCROLL TO TOP BUTTON
================================================== */
(function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ==================================================
   6. IMAGE LIGHTBOX + ESCAPE KEY (ACCESSIBILITY)
================================================== */
(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox || !lightboxImg) return;

  lightbox.setAttribute("role", "dialog");

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".lightbox-img");
    if (!img) return;

    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      lightbox.style.display = "none";
      lightbox.setAttribute("aria-hidden", "true");
    }
  });
})();

/* ==================================================
   7. FAQ ACCORDION – ONLY ONE OPEN
================================================== */
(function () {
  const faqItems = document.querySelectorAll(".faq-item input[type='checkbox']");
  if (!faqItems.length) return;

  faqItems.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      faqItems.forEach((other) => {
        if (other !== checkbox) other.checked = false;
      });
    });
  });
})();

/* ==================================================
   8. CURRENT YEAR IN FOOTER
================================================== */
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

let fontLevel = 0; // يتراوح من -3 إلى +3

// فتح وإغلاق اللوحة
document.getElementById('acc-toggle-btn').addEventListener('click', () => {
    document.getElementById('acc-panel').classList.toggle('hidden');
});

// 1. نظام التكبير (3 مستويات)
function stepFontSize(direction) {
    if ((direction === 1 && fontLevel < 3) || (direction === -1 && fontLevel > -3)) {
        fontLevel += direction;
        // كل خطوة تزيد أو تنقص 15%
        document.documentElement.style.fontSize = (100 + (fontLevel * 15)) + "%";
    }
}

function resetFontSize() {
    fontLevel = 0;
    document.documentElement.style.fontSize = "100%";
}

// 2. تغيير ألوان النصوص (عمى الألوان)
function changeColor(colorValue) {
    // يغير لون النصوص في الـ body بالكامل
    document.body.style.color = colorValue;
    // نطبق على كل العناصر النصية لضمان التغيير
    const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, li, a');
    elements.forEach(el => {
        el.style.color = colorValue;
    });
}

// 3. هايلايت العناوين
document.getElementById('title-highlight-toggle').addEventListener('change', function() {
    document.body.classList.toggle('title-highlight-active', this.checked);
});

// 4. هايلايت الروابط
document.getElementById('link-highlight-toggle').addEventListener('change', function() {
    document.body.classList.toggle('link-highlight-active', this.checked);
});

// 5. زر إعادة الضبط الشامل
function resetSettings() {
    resetFontSize();
    changeColor(''); // يعود للألوان الأصلية
    document.body.classList.remove('title-highlight-active', 'link-highlight-active');
    
    // إطفاء جميع الـ Switches
    document.querySelectorAll('.switch input').forEach(input => {
        input.checked = false;
    });
}

// إغلاق اللوحة عند الضغط في الخارج
window.onclick = function(event) {
    if (!event.target.matches('.acc-main-btn') && !event.target.closest('.acc-panel')) {
        document.getElementById('acc-panel').classList.add('hidden');
    }
}