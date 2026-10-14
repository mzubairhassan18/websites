/* ============================================================
   Mr. Mechanic — site behaviour
   ============================================================ */
(function () {
  'use strict';

  /* ---------- current year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- shop hours: Mon–Fri 8:00–18:00 ---------- */
  var OPEN_H = 8, CLOSE_H = 18;

  function shopState(now) {
    now = now || new Date();
    var d = now.getDay();               // 0 Sun … 6 Sat
    var mins = now.getHours() * 60 + now.getMinutes();
    var weekday = d >= 1 && d <= 5;
    var isOpen = weekday && mins >= OPEN_H * 60 && mins < CLOSE_H * 60;
    return { day: d, isOpen: isOpen, weekday: weekday };
  }

  function fmt(h) {
    var suffix = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':00 ' + suffix;
  }

  function paintStatus() {
    var s = shopState();
    var dot = document.getElementById('statusDot');
    var txt = document.getElementById('statusText');
    var tStat = document.getElementById('ticketStatus');
    var tHours = document.getElementById('ticketHours');

    if (dot) dot.classList.toggle('is-closed', !s.isOpen);
    if (tStat) {
      tStat.classList.toggle('is-closed', !s.isOpen);
      tStat.textContent = s.isOpen ? 'OPEN NOW' : 'CLOSED';
    }
    if (tHours) {
      tHours.textContent = s.weekday
        ? fmt(OPEN_H) + ' – ' + fmt(CLOSE_H)
        : 'Closed today';
    }
    if (txt) {
      if (s.isOpen) {
        txt.textContent = 'Open now · Closes ' + fmt(CLOSE_H);
      } else if (s.weekday) {
        txt.textContent = 'Closed · Opens ' + fmt(OPEN_H) + ' today';
      } else {
        // next opening is Monday 8 AM
        var wait = (8 - s.day + 7) % 7 || 7;
        txt.textContent = 'Closed · Opens Monday ' + fmt(OPEN_H);
        if (wait === 1) txt.textContent = 'Closed · Opens tomorrow ' + fmt(OPEN_H);
      }
    }
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* highlight today's row in the hours list */
  (function () {
    var today = shopState().day;
    var row = document.querySelector('.hours li[data-day="' + today + '"]');
    if (row) row.classList.add('is-today');
  })();

  /* ---------- sticky nav state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    if (!burger || !links) return;
    burger.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- active nav link ---------- */
  var sections = ['services', 'why', 'reviews', 'shop', 'about', 'faq']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- hero parallax ---------- */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroImg.style.transform = 'scale(1.06) translate3d(0,' + (y * 0.16) + 'px,0)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- appointment form ---------- */
  var form = document.getElementById('bookForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = (v || '').toString().trim(); });

      var required = ['name', 'phone', 'issue'];
      var bad = [];

      required.forEach(function (k) {
        var field = form.querySelector('[name="' + k + '"]');
        var wrap = field && field.closest('.field');
        var empty = !data[k];
        if (wrap) wrap.classList.toggle('is-bad', empty);
        if (empty) bad.push(k);
      });

      if (data.phone && data.phone.replace(/\D/g, '').length < 7) {
        var pf = form.querySelector('[name="phone"]').closest('.field');
        pf.classList.add('is-bad');
        if (bad.indexOf('phone') === -1) bad.push('phone');
      }

      if (bad.length) {
        status.className = 'form__status is-bad';
        status.textContent = 'Please fill in your name, a phone number we can reach you on, and what the car is doing.';
        var firstBad = form.querySelector('.field.is-bad input, .field.is-bad textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      status.className = 'form__status is-ok';
      status.textContent = 'Thanks ' + data.name.split(' ')[0] +
        ' — your request is ready. We’ll call ' + data.phone + ' to confirm a time. ' +
        'Need us right away? Call (409) 965-8881.';

      /* Static hosting has no backend. This hands the request to the
         visitor's mail client so nothing is silently dropped.
         Swap for a POST to Formspree/Netlify Forms when a backend exists. */
      var vehicle = [data.year, data.make, data.model].filter(Boolean).join(' ') || '—';
      var lines = [
        'Name: ' + data.name,
        'Phone: ' + data.phone,
        'Email: ' + (data.email || '—'),
        'Preferred: ' + (data.date || 'any date') + ' ' + (data.time || ''),
        'Vehicle: ' + vehicle,
        '',
        'Issue:',
        data.issue
      ];

      var subject = 'Appointment request — ' + data.name;
      var href = 'mailto:yzf1000fzy@aol.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;
      form.querySelector('button[type="submit"]').textContent = 'Request Sent ✓';
    });

    /* clear error styling as the visitor types */
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field');
      if (f) f.classList.remove('is-bad');
    });
  }
})();
