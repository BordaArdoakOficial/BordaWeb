(function () {
  var sliders = document.querySelectorAll('.category-slider');
  if (!sliders.length) return;

  sliders.forEach(function (slider) {
    var track = slider.querySelector('.category-track');
    if (!track) return;

    var offset = 0;
    var paused = false;
    var lastTime = null;
    var speed = 45; // pixels per second

    slider.addEventListener('mouseenter', function () { paused = true; });
    slider.addEventListener('mouseleave', function () { paused = false; });
    slider.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    slider.addEventListener('touchend', function () { paused = false; });

    function step(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      var delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (!paused) {
        offset += speed * delta;
        var half = track.scrollWidth / 2;
        if (half > 0 && offset >= half) offset -= half;
        track.style.transform = 'translateX(' + (-offset) + 'px)';
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
})();
