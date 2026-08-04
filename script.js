/* Torque Automotive NZ Ltd, site interactions */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Intro overlay ---- */
  var intro = document.querySelector('.intro');
  if (intro) {
    window.addEventListener('load', function () {
      setTimeout(function () { intro.classList.add('done'); }, reduce ? 0 : 1900);
    });
    // safety: never trap the page
    setTimeout(function () { intro.classList.add('done'); }, 3400);
  }

  /* ---- Nav scrolled state ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  var burger = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  var scrim = document.querySelector('.scrim');
  var closeBtn = document.querySelector('.menu-close');
  function openMenu() { if (menu) { menu.classList.add('open'); scrim.classList.add('open'); } }
  function closeMenu() { if (menu) { menu.classList.remove('open'); scrim.classList.remove('open'); } }
  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (scrim) scrim.addEventListener('click', closeMenu);
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---- Hero rotating slides ---- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  if (slides.length > 1) {
    if (reduce) {
      slides[0].classList.add('active');
    } else {
      var i = 0;
      slides[0].classList.add('active');
      setInterval(function () {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
      }, 5500);
    }
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Build Gmail compose links from split parts (avoids mailto + Cloudflare rewrite) ---- */
  document.querySelectorAll('a[data-gmail]').forEach(function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) +
      '&su=' + (a.getAttribute('data-su') || '') +
      '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
