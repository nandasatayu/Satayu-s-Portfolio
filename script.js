// script.js - Complete and corrected version

class PortfolioApp {
  constructor() {
    this.observers = new Map();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    this.initLoader();
    this.initializeComponents();
    this.setupEventListeners();
    this.initSmoothScrolling();
    this.initNavbarEffects();
    this.initAnimations();
    this.initContactForm();
    this.initDropdown();
    this.handleAccessibility();
    this.initHeroAnimation();
  }
   initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.onload = () => {
      // Wait for 3.5 seconds before hiding the loader
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1500); // 3500 milliseconds = 3.5 seconds
    };
  }

  initHeroAnimation() {
    // --- 1. Main Heading Typewriter Effect ---
    const heading = document.querySelector('.glitch-heading');
    if (heading) {
      const originalText = heading.textContent;
      let interval = null;

      const runTypewriterEffect = () => {
        let index = 0;
        heading.textContent = "";
        clearInterval(interval);

        interval = setInterval(() => {
          if (index < originalText.length) {
            heading.textContent += originalText[index];
            index++;
          } else {
            clearInterval(interval);
          }
        }, 100);
      };
      runTypewriterEffect();
    }

    // --- 2. Dynamic Subheading with Glitch Cycle Effect ---
    const subheading = document.getElementById('dynamic-subheading');
    if (subheading) {
      const texts = [
        "Frontend Developer",
        "Problem Solver",
        "AI/ML Enthusiast",
        "Creative Coder",
        "Full-Stack Aspirant",
        "Tech Innovator"
      ];
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
      let textIndex = 0;
      let interval = null;

      const glitchToNextText = () => {
        // Move to the next text in the array
        textIndex = (textIndex + 1) % texts.length;
        const nextText = texts[textIndex];
        let iteration = 0;

        clearInterval(interval);

        interval = setInterval(() => {
          subheading.textContent = nextText
            .split("")
            .map((letter, index) => {
              // Reveal letters one by one
              if (index < iteration) {
                return nextText[index];
              }
              // Scramble the rest
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

          // When the new text is fully revealed
          if (iteration >= nextText.length) {
            clearInterval(interval);
            // Wait for 3 seconds, then start the next glitch
            setTimeout(glitchToNextText, 3000);
          }

          iteration += 1 / 3;
        }, 50); // Speed of the glitch effect
      };

      // Start the first cycle
      glitchToNextText();
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  initializeComponents() {
    this.navbar = document.querySelector('.navbar');
    this.contactForm = document.querySelector('.contact-form');
    this.formMessage = document.getElementById('form-message');
  }

  setupEventListeners() {
    window.addEventListener('scroll', this.debounce(() => {
      this.handleScroll();
    }, 16), { passive: true });
  }

  initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: this.prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  initNavbarEffects() {
    if (!this.navbar) return;
    this.handleNavbarScroll();
  }

  handleNavbarScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  initAnimations() {
    const elementsToAnimate = document.querySelectorAll(`
      .section-heading,
      .timeline-card,
      .project-card,
      .contact-form,
      .about-heading,
      .about-content
    `);

    if (this.prefersReducedMotion) {
      elementsToAnimate.forEach(el => el.style.opacity = '1');
      return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    elementsToAnimate.forEach((element, index) => {
      element.classList.add('fade-up');
      if (element.classList.contains('timeline-card')) {
        element.style.transitionDelay = `${index * 0.1}s`;
      }
      observer.observe(element);
    });

    this.updateTimelineLine();
  }

  handleScroll() {
    this.handleNavbarScroll();
    this.updateTimelineLine();
  }

  updateTimelineLine() {
    const timelineLines = document.querySelectorAll('.timeline-line');
    
    timelineLines.forEach(line => {
      const section = line.closest('.timeline-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
        const progress = Math.min(1, visibleHeight / rect.height);
        line.style.height = `${progress * rect.height}px`;
      }
    });
  }

  async initEmailJS() {
    try {
      if (typeof emailjs === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not loaded');
        }
      }
      // IMPORTANT: Double-check that this Public Key is correct in your EmailJS account.
      emailjs.init("FTBswrm1hgbRpx2Zs");
      return true;
    } catch (error) {
      console.warn('EmailJS initialization failed:', error);
      return false;
    }
  }

  async initContactForm() {
    if (!this.contactForm) return;

    this.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailJSReady = await this.initEmailJS();
      
      if (!emailJSReady) {
        this.showFormMessage('Email service unavailable. Please contact directly.', 'error');
        return;
      }

      await this.handleFormSubmission();
    });
  }

  async handleFormSubmission() {
    const submitButton = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // --- CORRECTED IDS ARE HERE ---
      await emailjs.sendForm("service_g7nkihk", "template_oavmzg2", this.contactForm);
      
      this.showFormMessage('✅ Message sent successfully!', 'success');
      this.contactForm.reset();
      
    } catch (error) {
      console.error('Email send failed:', error);
      this.showFormMessage('❌ Error sending message. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  showFormMessage(message, type) {
    if (!this.formMessage) return;

    this.formMessage.style.display = 'block';
    this.formMessage.textContent = message;
    
    if (type === 'success') {
      this.formMessage.style.color = '#39FF14';
    } else {
      this.formMessage.style.color = '#FF073A';
    }

    setTimeout(() => {
      this.formMessage.style.display = 'none';
    }, 5000);
  }

  initDropdown() {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (!toggle) return;

    const toggleDropdown = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    };

    toggle.addEventListener('click', toggleDropdown);

    document.addEventListener('click', () => {
      if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
      }
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(e);
      }
    });
  }

  handleAccessibility() {
    const interactiveElements = document.querySelectorAll('a, button, .dropdown-toggle');
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '2px solid #00ffff';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = '';
      });
    });
  }
}

// Initialize the application
let portfolioApp;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    portfolioApp = new PortfolioApp();
  });
} else {
  portfolioApp = new PortfolioApp();
}
