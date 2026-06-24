/* 
   Closeit.in - Modern Thrift Marketplace Javascript
   Author: Antigravity AI
*/

document.addEventListener('DOMContentLoaded', () => {
  // === DOM ELEMENTS ===
  const header = document.querySelector('header');
  const themeToggle = document.getElementById('theme-toggle');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const backToTop = document.getElementById('back-to-top');
  
  // === STICKY HEADER ===
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // === ACTIVE NAVBAR LINK CORRECTION ===
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // === DARK MODE SYSTEM ===
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = 'light';
      if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        theme = 'dark';
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', theme);
    });
  }

  // === MOBILE NAVIGATION HAMBURGER ===
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking links
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // === SCROLL REVEAL ANIMATION ===
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealOnScroll.observe(el));

  // === STATS COUNTER ANIMATION ===
  const counters = document.querySelectorAll('.counter-num');
  const countUp = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const speed = 200; // lower is faster
    const increment = Math.ceil(target / speed);
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = count + suffix;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target + suffix;
      }
    };
    updateCount();
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // === INSTAGRAM-STYLE SELLER PROFILE TABS ===
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Hide all panes
        tabPanes.forEach(pane => pane.classList.remove('active'));
        // Show selected pane
        const targetId = btn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // === TESTIMONIAL CAROUSEL SLIDER ===
  const track = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.carousel-nav');
  const cards = document.querySelectorAll('.testimonial-card');

  if (track && cards.length > 0) {
    let index = 0;
    const cardsPerView = () => {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    const totalSlides = () => {
      return Math.ceil(cards.length / cardsPerView());
    };

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const slidesCount = totalSlides();
      for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(i);
        });
        dotsContainer.appendChild(dot);
      }
    };

    const goToSlide = (slideIndex) => {
      index = slideIndex;
      const slidesCount = totalSlides();
      
      // Safety limit
      if (index >= slidesCount) index = 0;
      if (index < 0) index = slidesCount - 1;

      const cardWidthPercentage = 100 / cardsPerView();
      const offset = -(index * cardWidthPercentage * cardsPerView());
      track.style.transform = `translateX(${offset}%)`;

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, dIdx) => {
          if (dIdx === index) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    // Initialize dots and handle window resize
    buildDots();
    window.addEventListener('resize', () => {
      buildDots();
      goToSlide(0);
    });

    // Autoplay
    let autoplayInterval = setInterval(() => {
      goToSlide(index + 1);
    }, 4000);

    // Pause autoplay on mouse enter
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    track.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(() => {
        goToSlide(index + 1);
      }, 4000);
    });
  }

  // === FAQ ACCORDION ===
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-answer').style.maxHeight = null;
      });

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // === LIKE/FAVORITE INTERACTION ===
  const actionButtons = document.querySelectorAll('.card-action-btn, .like-btn');
  actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      
      // Update heart icon filled color
      const heartIcon = btn.querySelector('svg');
      if (heartIcon) {
        if (btn.classList.contains('active')) {
          heartIcon.style.fill = 'var(--heart)';
          heartIcon.style.stroke = 'var(--heart)';
        } else {
          heartIcon.style.fill = 'none';
          heartIcon.style.stroke = 'currentColor';
        }
      }
    });
  });

  // === NEWSLETTER FORM INTERACTION ===
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const email = input.value.trim();
      if (email) {
        alert(`Thank you for subscribing! We've sent a welcome email to ${email}.`);
        input.value = '';
      }
    });
  }

  // === CONTACT FORM INTERACTION ===
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (name && email && subject && message) {
        alert(`Hello ${name}, thank you for reaching out to Closeit.in. We have received your query regarding "${subject}" and will respond to you at ${email} shortly.`);
        contactForm.reset();
      } else {
        alert('Please fill out all form fields.');
      }
    });
  }

  // === BACK TO TOP BUTTON ===
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
