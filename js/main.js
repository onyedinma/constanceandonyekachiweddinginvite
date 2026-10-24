/**
 * MAIN INTERACTION & NAVIGATION COORDINATOR (UPGRADED)
 * Constance Onyinyechi David & Onyekachi Onyedinma Wedding
 */

(function () {
  'use strict';

  function initApp() {
    const navbar = document.getElementById('royal-nav');
    const scrollProgress = document.getElementById('nav-scroll-progress');
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    // 1. NAVBAR SCROLL PROGRESS & SCROLLED STATE
    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Toggle compact scrolled appearance
      if (navbar) {
        if (scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Update hairline progress bar
      if (scrollProgress && docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        scrollProgress.style.width = progress + '%';
      }

      // 2. SCROLLSPY (Highlight active section)
      const sections = ['hero', 'rings', 'countdown', 'venues', 'colours', 'registry', 'vip-pass', 'rsvp'];
      let currentSection = 'hero';

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            currentSection = id;
          }
        }
      });

      // Update desktop links
      document.querySelectorAll('.nav-links .nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update mobile links
      document.querySelectorAll('.mobile-nav-links .mobile-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3. MOBILE DRAWER CONTROLS
    function openDrawer() {
      if (mobileDrawer) mobileDrawer.classList.add('active');
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
      if (mobileToggle) mobileToggle.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    }

    function closeDrawer() {
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
      if (mobileToggle) mobileToggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileDrawer && mobileDrawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }

    // Close drawer on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // 4. SMOOTH SCROLL FOR ALL ANCHORS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          closeDrawer();

          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 5;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // 5. GSAP SCROLL REVEALS
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out'
        });
      });

      gsap.utils.toArray('.venue-card').forEach((card, idx) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          delay: idx * 0.15,
          ease: 'power2.out'
        });
      });
    }

    // 6. INITIALIZE ICONS
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
