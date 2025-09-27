// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".nav__menu");
  const hamburger = document.querySelector(".nav__hamburger");

  // Function to close menu
  function closeMenu() {
    menuToggle.checked = false;
    navMenu.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Function to open menu
  function openMenu() {
    menuToggle.checked = true;
    navMenu.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Toggle mobile menu
  if (menuToggle && navMenu && hamburger) {
    menuToggle.addEventListener("change", function () {
      if (this.checked) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        closeMenu();

        // Get the href and scroll to the section if it exists
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            setTimeout(() => {
              targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 300); // Wait for menu to close
          }
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target) &&
        menuToggle.checked
      ) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuToggle.checked) {
        closeMenu();
      }
    });
  }
});

// Testimonials Slider
class TestimonialsSlider {
  constructor() {
    this.track = document.querySelector(".testimonials__track");
    this.testimonials = document.querySelectorAll(".testimonial");
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoSlideInterval = null;

    if (this.track && this.testimonials.length > 0) {
      this.init();
    }
  }

  init() {
    this.setupSlider();
    this.createNavigation();
    this.createArrows();
    this.startAutoSlide();
    this.setupTouchEvents();
    this.pauseOnHover();
  }

  setupSlider() {
    // Set initial position
    this.track.style.transition = "transform 0.3s ease";
    this.updateSlider();
  }

  createNavigation() {
    const sliderContainer = document.querySelector(".testimonials__slider");
    if (!sliderContainer) return;

    // Create navigation dots
    const navContainer = document.createElement("div");
    navContainer.className = "slider__navigation";

    for (let i = 0; i < this.testimonials.length; i++) {
      const dot = document.createElement("button");
      dot.className = "slider__dot";
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);

      if (i === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => this.goToSlide(i));
      navContainer.appendChild(dot);
    }

    sliderContainer.appendChild(navContainer);
    this.dots = navContainer.querySelectorAll(".slider__dot");
  }

  createArrows() {
    const sliderContainer = document.querySelector(".testimonials__slider");
    if (!sliderContainer) return;

    // Create previous arrow
    const prevArrow = document.createElement("button");
    prevArrow.className = "slider__arrow slider__arrow--prev";
    prevArrow.setAttribute("aria-label", "Previous testimonial");
    prevArrow.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    `;
    prevArrow.addEventListener("click", () => this.prevSlide());

    // Create next arrow
    const nextArrow = document.createElement("button");
    nextArrow.className = "slider__arrow slider__arrow--next";
    nextArrow.setAttribute("aria-label", "Next testimonial");
    nextArrow.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;
    nextArrow.addEventListener("click", () => this.nextSlide());

    sliderContainer.appendChild(prevArrow);
    sliderContainer.appendChild(nextArrow);
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    this.track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    this.track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    });
  }

  updateSlider() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const slideWidth = this.testimonials[0].offsetWidth + 32; // 32px for gap
    const translateX = -this.currentIndex * slideWidth;

    this.track.style.transform = `translateX(${translateX}px)`;

    this.updateDots();

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateSlider();
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateSlider();
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.currentIndex =
      this.currentIndex === 0
        ? this.testimonials.length - 1
        : this.currentIndex - 1;
    this.updateSlider();
  }

  updateDots() {
    if (!this.dots) return;

    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Auto-advance every 5 seconds
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  // Pause auto-slide on hover
  pauseOnHover() {
    const slider = document.querySelector(".testimonials__slider");
    if (slider) {
      slider.addEventListener("mouseenter", () => this.stopAutoSlide());
      slider.addEventListener("mouseleave", () => this.startAutoSlide());
    }
  }
}

// Newsletter Form Validation
class NewsletterForm {
  constructor() {
    this.form = document.getElementById("newsletter-form");
    this.emailInput = document.getElementById("newsletter-email");
    this.errorElement = document.getElementById("newsletter-error");

    if (this.form && this.emailInput && this.errorElement) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.emailInput.addEventListener("input", () => this.clearError());
  }

  handleSubmit(e) {
    e.preventDefault();

    const email = this.emailInput.value.trim();

    // Clear previous errors
    this.clearError();

    // Validate email
    if (!email) {
      this.showError("Please enter an email address");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Please enter a valid email address");
      return;
    }

    // If validation passes, show success message
    this.showSuccess("Thank you for subscribing!");
    this.emailInput.value = "";
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message) {
    this.errorElement.textContent = message;
    this.errorElement.style.display = "block";
    this.emailInput.style.borderColor = "#f25f3a";
    this.emailInput.focus();
  }

  showSuccess(message) {
    this.errorElement.textContent = message;
    this.errorElement.style.color = "#4caf50";
    this.errorElement.style.display = "block";
    this.emailInput.style.borderColor = "#4caf50";

    // Hide success message after 3 seconds
    setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  clearError() {
    this.errorElement.textContent = "";
    this.errorElement.style.display = "none";
    this.errorElement.style.color = "#f25f3a";
    this.emailInput.style.borderColor = "";
  }
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize testimonials slider
  new TestimonialsSlider();

  // Initialize newsletter form
  new NewsletterForm();

  // Add loading animation
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Handle window resize for responsive adjustments
window.addEventListener("resize", function () {
  // Recalculate slider positions on resize
  const slider = document.querySelector(".testimonials__track");
  if (slider) {
    slider.style.transition = "none";
    setTimeout(() => {
      slider.style.transition = "transform 0.3s ease";
    }, 100);
  }
});

// Keyboard navigation for accessibility
document.addEventListener("keydown", function (e) {
  // Close mobile menu with Escape key
  if (e.key === "Escape") {
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
      const navMenu = document.querySelector(".nav__menu");
      if (navMenu) {
        navMenu.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener("DOMContentLoaded", function () {
  const animatedElements = document.querySelectorAll(".feature, .testimonial");

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});
