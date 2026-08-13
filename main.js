// Function to start everything
function initAll() {
  loadComponents();
  initFaqAccordion();
  initFadeInObserver();
  initSmoothScroll();
  initNumberCounters();
}

// SAFE INITIALIZATION: Run immediately if DOM is ready, otherwise listen
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}

/* ==========================================================================
   1. COMPONENT LOADER (Header & Footer)
   ========================================================================== */
function loadComponents() {
  const headerPlaceholder = document.getElementById("global-header");
  const footerPlaceholder = document.getElementById("global-footer");

  // Load Header
  if (headerPlaceholder) {
    fetch("components/header.html")
      .then(response => {
        if (!response.ok) throw new Error("Failed to load header");
        return response.text();
      })
      .then(data => {
        headerPlaceholder.innerHTML = data;
        // CRITICAL FIX: Initialize header event listeners AFTER HTML is injected
        initHeaderEvents();
      })
      .catch(err => console.error("Header Fetch Error:", err));
  } else {
    // Fallback: If header is already hardcoded on the page
    initHeaderEvents();
  }

  // Load Footer
  if (footerPlaceholder) {
    fetch("components/footer.html")
      .then(response => {
        if (!response.ok) throw new Error("Failed to load footer");
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
      })
      .catch(err => console.error("Footer Fetch Error:", err));
  }
}

/* ==========================================================================
   2. HEADER & NAVIGATION EVENTS
   ========================================================================== */
function initHeaderEvents() {
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  // Header Scroll Effect
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Hamburger Menu Toggle
  if (hamburger && mobileNav) {
    // Toggle Menu
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents instant closing via document click
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("open");
    });

    // Close mobile nav when any menu link is clicked
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("open");
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("open");
      }
    });
  }
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  if (!faqQuestions.length) return;

  faqQuestions.forEach(button => {
    button.addEventListener("click", () => {
      const faqItem = button.parentElement;
      const answer = faqItem.querySelector(".faq-answer");
      const isActive = faqItem.classList.contains("active");

      // Close all other FAQ items
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
        const itemBtn = item.querySelector(".faq-question");
        const itemAns = item.querySelector(".faq-answer");
        if (itemBtn) itemBtn.setAttribute("aria-expanded", "false");
        if (itemAns) itemAns.style.maxHeight = "0";
      });

      // Toggle clicked item
      if (!isActive && answer) {
        faqItem.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL ANIMATIONS (Fade-in)
   ========================================================================== */
function initFadeInObserver() {
  const fadeElements = document.querySelectorAll(".fade-in");
  if (!fadeElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));
}

/* ==========================================================================
   5. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE NUMBER COUNTER
   ========================================================================== */
function initNumberCounters() {
  const valueDisplaysTwo = document.querySelectorAll(".cstwo-metric-value");
  if (!valueDisplaysTwo.length) return;

  valueDisplaysTwo.forEach((display) => {
    const targetVal = parseFloat(display.getAttribute("data-target2"));
    const isPercent = display.getAttribute("data-is-percent2") === "true";
    const isInt = display.getAttribute("data-is-int2") === "true";
    
    let duration = 1800;
    let startTime = null;

    function animateCountTwo(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = progress * targetVal;

      if (isPercent) {
        display.innerHTML = currentValue.toFixed(2) + "%";
      } else if (isInt) {
        display.innerHTML = Math.floor(currentValue).toLocaleString();
      } else {
        display.innerHTML = "£" + Math.floor(currentValue).toLocaleString();
      }

      if (progress < 1) {
        window.requestAnimationFrame(animateCountTwo);
      } else {
        if (isPercent) display.innerHTML = targetVal + "%";
        else if (isInt) display.innerHTML = targetVal.toLocaleString();
        else display.innerHTML = "£" + targetVal.toLocaleString();
      }
    }

    const observerOptionsTwo = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const observerTwo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !display.hasAttribute("data-animated2")) {
          window.requestAnimationFrame(animateCountTwo);
          display.setAttribute("data-animated2", "true");
          observerTwo.unobserve(entry.target);
        }
      });
    }, observerOptionsTwo);

    observerTwo.observe(display);
  });
}