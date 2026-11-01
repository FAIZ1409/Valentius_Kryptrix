/* ==========================================================================
   Portfolio interactions — vanilla JS, no dependencies
   Every lookup is null-guarded so a missing element can never throw.
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var root = document.documentElement;

    var header      = document.getElementById('site-header');
    var nav         = document.getElementById('primary-nav');
    var navToggle   = document.getElementById('nav-toggle');
    var themeToggle = document.getElementById('theme-toggle');
    var yearEl      = document.getElementById('year');
    var filterStatus = document.getElementById('filter-status');

    /* ---------------------------------------------------------------- */
    /* 1. Theme toggle (persisted, respects system preference initially) */
    /* ---------------------------------------------------------------- */
    function applyTheme(theme, persist) {
      var isDark = theme === 'dark';
      root.setAttribute('data-theme', isDark ? 'dark' : 'light');

      if (persist) {
        try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (e) {}
      }
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute(
          'aria-label',
          isDark ? 'Switch to light theme' : 'Switch to dark theme'
        );
      }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#0c0e14' : '#f6f7fb');
    }

    /* Sync the button state with whatever the <head> script already set. */
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }

    /* ---------------------------------------------------------------- */
    /* 2. Mobile navigation                                              */
    /* ---------------------------------------------------------------- */
    function closeNav() {
      if (!nav) return;
      nav.classList.remove('is-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    if (nav && navToggle) {
      navToggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
      });

      /* Close after tapping any link */
      nav.addEventListener('click', function (e) {
        if (e.target && e.target.closest('a')) closeNav();
      });

      /* Escape closes it */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });

      /* Click outside closes it */
      document.addEventListener('click', function (e) {
        if (!nav.classList.contains('is-open')) return;
        if (nav.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
      });

      /* Going desktop-sized closes it */
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 900) closeNav();
      });
    }

    /* ---------------------------------------------------------------- */
    /* 3. Header shadow on scroll                                        */
    /* ---------------------------------------------------------------- */
    if (header) {
      var syncHeader = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      syncHeader();
      window.addEventListener('scroll', syncHeader, { passive: true });
    }

    /* ---------------------------------------------------------------- */
    /* 4. Scroll spy — highlights the nav link for the section in view   */
    /* ---------------------------------------------------------------- */
    var navLinks = nav
      ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'))
      : [];

    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.length > 1 ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    function setActive(id) {
      navLinks.forEach(function (link) {
        var match = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', match);
        if (match) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window && sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach(function (section) { spy.observe(section); });
    }

    /* ---------------------------------------------------------------- */
    /* 5. Scroll reveal — with a hard fail-safe                          */
    /* ---------------------------------------------------------------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    function revealAll() {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    if (revealEls.length) {
      if (!('IntersectionObserver' in window)) {
        revealAll();
      } else {
        try {
          var revealer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealer.unobserve(entry.target);
              });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
          );
          revealEls.forEach(function (el) { revealer.observe(el); });

          /* Safety net: if anything is still hidden but on screen after
             1.5s, just show it rather than leaving content invisible. */
          window.setTimeout(function () {
            revealEls.forEach(function (el) {
              if (el.classList.contains('is-visible')) return;
              if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('is-visible');
              }
            });
          }, 1500);
        } catch (err) {
          revealAll();
        }
      }
    }

    /* ---------------------------------------------------------------- */
    /* 6. Project filter                                                 */
    /* ---------------------------------------------------------------- */
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
    var projectCards  = Array.prototype.slice.call(document.querySelectorAll('.project-card'));

    if (filterButtons.length && projectCards.length) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter') || 'all';

          filterButtons.forEach(function (b) {
            var active = b === btn;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', String(active));
          });

          var shown = 0;
          projectCards.forEach(function (card) {
            var cats = (card.getAttribute('data-category') || '').split(/\s+/);
            var match = filter === 'all' || cats.indexOf(filter) !== -1;
            card.hidden = !match;
            if (match) shown += 1;
          });

          if (filterStatus) {
            filterStatus.textContent =
              shown + (shown === 1 ? ' project shown' : ' projects shown') +
              (filter === 'all' ? '.' : ' in ' + filter + '.');
          }
        });
      });
    }

    /* ---------------------------------------------------------------- */
    /* 7. Footer year                                                    */
    /* ---------------------------------------------------------------- */
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* Wrap everything: if any single interaction fails, reveal the content
     instead of leaving sections invisible. */
  try {
    init();
  } catch (err) {
    console.error('Portfolio script error:', err);
    var hidden = document.querySelectorAll('.reveal');
    for (var i = 0; i < hidden.length; i++) {
      hidden[i].classList.add('is-visible');
    }
  }
})();
