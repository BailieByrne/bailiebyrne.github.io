(function () {
  function markActiveTab() {
    var current = document.body.dataset.page;
    var links = document.querySelectorAll('[data-page-link]');
    links.forEach(function (link) {
      if (link.dataset.pageLink === current) {
        link.classList.add('active');
      }
    });
    return current;
  }

  function shouldPlayIntro(current) {
    if (current !== 'home') return false;

    // Check if intro has already been shown in this session
    if (sessionStorage.getItem('introShown')) {
      return false;
    }

    return true;
  }

  function runIntroIfNeeded(current) {
    if (!shouldPlayIntro(current)) return;

    // Mark intro as shown for this session
    sessionStorage.setItem('introShown', 'true');

    var overlay = document.createElement('div');
    overlay.className = 'intro-overlay';
    overlay.innerHTML = [
      '<div class="intro-lines"></div>',
      '<div class="intro-card">',
        '<p class="intro-sub">Welcome</p>',
        '<h2 class="intro-title">Bailie Byrne</h2>',
        '<p class="intro-cta">Software Engineering · Scalability · Efficiency</p>',
      '</div>'
    ].join('');

    document.body.classList.add('intro-playing');
    document.body.appendChild(overlay);

    function cleanup() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.classList.remove('intro-playing');
    }

    overlay.addEventListener('animationend', function (e) {
      if (e.animationName === 'introOverlayFade') cleanup();
    });

    setTimeout(cleanup, 3200);
  }

  function init() {
    var current = markActiveTab();
    runIntroIfNeeded(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
