/* Lantern & Leaves, Version 2 (the Quest): light page behaviours.
   Kept from forest.js: touch "lighting" of gallery tiles, the home header
   state, gentle reveals for headings, and light photo protection.
   Dropped on purpose: fireflies, falling leaves, the vine and parallax.
   Everything motion-related is skipped when the visitor prefers reduced motion. */
(function () {
  "use strict";

  window.__forest = true;           // keeps the inline "fx" flag (see <head>)
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  if (reduce || !hasIO) doc.classList.remove("fx");

  /* Touch screens: a tile lights up once when it reaches the middle of the
     screen and then stays lit. Mouse devices use :hover. */
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover && hasIO) {
    var litIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-lit"); litIO.unobserve(en.target); }
      });
    }, { rootMargin: "-25% 0px -25% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll(".masonry > a, .portal"), function (a) { litIO.observe(a); });
  }

  /* Home header: transparent over the illustration, parchment once scrolled. */
  var header = document.querySelector(".site-header");
  var ticking = false;
  function headerState() { ticking = false; if (header) header.classList.toggle("is-scrolled", window.scrollY > 40); }
  headerState();
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(headerState); } }, { passive: true });

  /* Titles and text fade in once; photo grids never do. */
  if (doc.classList.contains("fx")) {
    var groups = document.querySelectorAll(".album-copy, .page-header, .portal-text");
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-visible");
        revIO.unobserve(el);
        setTimeout(function () { el.classList.add("is-done"); }, 1600);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    Array.prototype.forEach.call(groups, function (g) { g.classList.add("reveal"); revIO.observe(g); });
  }
})();

/* Light photo protection: no right-click menu, drag-to-desktop, or
   long-press save on images. Links and the rest of the page work as usual. */
(function () {
  function isImg(t) { return t && t.tagName === "IMG"; }
  document.addEventListener("contextmenu", function (e) { if (isImg(e.target)) e.preventDefault(); });
  document.addEventListener("dragstart", function (e) { if (isImg(e.target)) e.preventDefault(); });
})();
