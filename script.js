// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".nav__menu");
  const hamburger = document.querySelector(".nav__hamburger");

  // Toggle mobile menu
  if (menuToggle && navMenu && hamburger) {
    menuToggle.addEventListener("change", function () {
      if (this.checked) {
        navMenu.style.display = "flex";
        document.body.style.overflow = "hidden";
      } else {
        navMenu.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.checked = false;
        navMenu.style.display = "none";
        document.body.style.overflow = "auto";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target) &&
        menuToggle.checked
      ) {
        menuToggle.checked = false;
        navMenu.style.display = "none";
        document.body.style.overflow = "auto";
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

    if (this.track && this.testimonials.length > 0) {
      this.init();
    }
  }

  init() {
    this.setupSlider();
    this.createNavigation();
    this.startAutoSlide();
  }

  setupSlider() {
    // Clone first and last testimonials for infinite loop
    const firstClone = this.testimonials[0].cloneNode(true);
    const lastClone =
      this.testimonials[this.testimonials.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    this.track.appendChild(firstClone);
    this.track.insertBefore(lastClone, this.testimonials[0]);

    // Update testimonials NodeList
    this.testimonials = document.querySelectorAll(".testimonial");
    this.currentIndex = 1; // Start at first real testimonial

    this.updateSlider();
  }

  createNavigation() {
    const sliderContainer = document.querySelector(".testimonials__slider");
    if (!sliderContainer) return;

    // Create navigation dots
    const navContainer = document.createElement("div");
    navContainer.className = "slider__navigation";
    navContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
    `;

    for (let i = 0; i < this.testimonials.length - 2; i++) {
      // -2 for clones
      const dot = document.createElement("button");
      dot.className = "slider__dot";
      dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background-color: #ccc;
        cursor: pointer;
        transition: background-color 0.3s ease;
      `;

      if (i === 0) {
        dot.style.backgroundColor = "#f25f3a";
      }

      dot.addEventListener("click", () => this.goToSlide(i + 1));
      navContainer.appendChild(dot);
    }

    sliderContainer.appendChild(navContainer);
    this.dots = navContainer.querySelectorAll(".slider__dot");
  }

  updateSlider() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const slideWidth = this.testimonials[0].offsetWidth + 32; // 32px for gap
    const translateX = -this.currentIndex * slideWidth;

    this.track.style.transform = `translateX(${translateX}px)`;

    // Handle infinite loop
    setTimeout(() => {
      if (this.currentIndex === 0) {
        this.track.style.transition = "none";
        this.track.style.transform = `translateX(-${
          (this.testimonials.length - 2) * slideWidth
        }px)`;
        this.currentIndex = this.testimonials.length - 2;
        setTimeout(() => {
          this.track.style.transition = "transform 0.3s ease";
        }, 50);
      } else if (this.currentIndex === this.testimonials.length - 1) {
        this.track.style.transition = "none";
        this.track.style.transform = `translateX(-${slideWidth}px)`;
        this.currentIndex = 1;
        setTimeout(() => {
          this.track.style.transition = "transform 0.3s ease";
        }, 50);
      }

      this.updateDots();
      this.isAnimating = false;
    }, 300);
  }

  goToSlide(index) {
    if (this.isAnimating) return;
    this.currentIndex = index;
    this.updateSlider();
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.currentIndex++;
    this.updateSlider();
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.currentIndex--;
    this.updateSlider();
  }

  updateDots() {
    if (!this.dots) return;

    this.dots.forEach((dot, index) => {
      const realIndex = this.currentIndex - 1;
      if (index === realIndex) {
        dot.style.backgroundColor = "#f25f3a";
      } else {
        dot.style.backgroundColor = "#ccc";
      }
    });
  }

  startAutoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Auto-advance every 5 seconds
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
