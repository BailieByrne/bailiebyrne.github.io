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

  function runIntroOnce(current) {
    if (current !== 'home') return;

    var hasSeen = false;
    try {
      hasSeen = localStorage.getItem('introSeen') === '1';
      if (!hasSeen) localStorage.setItem('introSeen', '1');
    } catch (err) {
      // Ignore storage errors; still show once per load.
    }
    if (hasSeen) return;

    var overlay = document.createElement('div');
    overlay.className = 'intro-overlay';
    overlay.innerHTML = [
      '<div class="intro-lines"></div>',
      '<div class="intro-card">',
        '<p class="intro-sub">Welcome</p>',
        '<h2 class="intro-title">Bailie Byrne</h2>',
        '<p class="intro-cta">Systems builder · Low-latency · Clean delivery</p>',
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
    runIntroOnce(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
