/* ===================================================
   和牛キャンペーン LP
   =================================================== */
(function () {
  'use strict';

  var supportsSD = CSS.supports && CSS.supports('animation-timeline', 'view()');

  /* --- Scroll-driven fallback --- */
  if (!supportsSD) {
    var targets = document.querySelectorAll(
      '.reveal,.reveal-left,.reveal-right,.reveal-scale,.bridge__heading,.photo-break__num,.scale__number'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });

    var prog = document.querySelector('.progress');
    if (prog) {
      window.addEventListener('scroll', function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0) prog.style.transform = 'scaleX(' + (window.scrollY / h) + ')';
      }, { passive: true });
    }
  }

  /* --- Header shadow --- */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* --- Number counter --- */
  var counters = document.querySelectorAll('.count-target');
  var counted = new Set();
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !counted.has(e.target)) {
          counted.add(e.target);
          runCount(e.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  function runCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(end) || end === 0) { el.textContent = end; return; }
    var dur = 1400, t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * end);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end;
    }
    requestAnimationFrame(tick);
  }

  /* --- Sticky bar --- */
  var bar = document.getElementById('stickyBar');
  var hero = document.getElementById('hero');
  var dl = document.getElementById('download');
  if (bar && hero && dl) {
    var sticking = false;
    window.addEventListener('scroll', function () {
      if (!sticking) {
        requestAnimationFrame(function () {
          var hb = hero.getBoundingClientRect().bottom;
          var ft = dl.getBoundingClientRect().top;
          bar.classList.toggle('is-visible', hb < 0 && ft > window.innerHeight);
          sticking = false;
        });
        sticking = true;
      }
    }, { passive: true });
  }

  /* --- Smooth scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* --- Magnetic CTA (desktop only) --- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.cta').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - r.left - r.width / 2;
        var dy = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translateY(-2px) translate(' + (dx * 0.08) + 'px,' + (dy * 0.08) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* --- FAQ smooth open/close --- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var summary = item.querySelector('summary');
    var answer = item.querySelector('.faq__a');
    if (!summary || !answer) return;

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(function () {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
        });
        answer.addEventListener('transitionend', function handler() {
          item.open = false;
          answer.style.maxHeight = '';
          answer.style.opacity = '';
          answer.removeEventListener('transitionend', handler);
        });
      } else {
        item.open = true;
        var h = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height .4s ease, opacity .4s ease';
        requestAnimationFrame(function () {
          answer.style.maxHeight = h + 'px';
          answer.style.opacity = '1';
        });
        answer.addEventListener('transitionend', function handler() {
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.transition = '';
          answer.removeEventListener('transitionend', handler);
        });
      }
    });
  });

})();
