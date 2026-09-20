(function () {
  var INTERVAL = 5500;
  var root = document.getElementById("tribute");
  if (!root) return;

  var slides = [
    { name: "Einstein", line: "Saw the invisible structure of reality." },
    { name: "Picasso", line: "Remade how we see." },
    { name: "Earhart", line: "Went where the maps ended." },
    { name: "Gandhi", line: "Changed power without force." },
    { name: "Edison", line: "Turned imagination into working light." }
  ];

  var images = root.querySelectorAll(".tribute-frame img");
  var dots = root.querySelectorAll(".tribute-dots button");
  var nameEl = document.getElementById("tribute-name");
  var lineEl = document.getElementById("tribute-line");
  var live = document.getElementById("tribute-live");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var index = 0;
  var timer = null;
  var paused = false;
  var announced = false;

  function show(n) {
    index = (n + slides.length) % slides.length;
    var slide = slides[index];

    images.forEach(function (img, i) {
      var on = i === index;
      img.classList.toggle("is-on", on);
      img.setAttribute("aria-hidden", on ? "false" : "true");
    });

    dots.forEach(function (dot, i) {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });

    nameEl.textContent = slide.name;
    lineEl.textContent = slide.line;

    if (announced) live.textContent = slide.name + ". " + slide.line;
    announced = true;
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function play() {
    stop();
    if (paused || reduced.matches || document.hidden) return;
    timer = setInterval(function () {
      show(index + 1);
    }, INTERVAL);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      show(i);
      play();
    });
  });

  root.addEventListener("mouseenter", function () {
    paused = true;
    stop();
  });
  root.addEventListener("mouseleave", function () {
    paused = false;
    play();
  });
  root.addEventListener("focusin", function () {
    paused = true;
    stop();
  });
  root.addEventListener("focusout", function (event) {
    if (!root.contains(event.relatedTarget)) {
      paused = false;
      play();
    }
  });

  document.addEventListener("visibilitychange", play);
  if (reduced.addEventListener) reduced.addEventListener("change", play);
  else if (reduced.addListener) reduced.addListener(play);

  show(0);
  play();
})();
