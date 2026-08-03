(function () {
  var btn = document.querySelector('.scroll-top');
  if (!btn) return;

  var toggle = function () {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();
