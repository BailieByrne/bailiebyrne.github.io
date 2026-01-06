// Animated hexagon background with glow effect on hover
(function() {
  var bgContainer = null;
  
  function createHexagons() {
    if (!bgContainer) return;
    
    // Clear existing hexagons
    bgContainer.innerHTML = '';
    
    // hexagon configuration
    var hexSize = 80;
    var hexSpacing = 10;
    var rows = Math.ceil(window.innerHeight / (hexSize + hexSpacing)) + 2;
    var cols = Math.ceil(window.innerWidth / (hexSize + hexSpacing)) + 2;

    // Create hexagons in a grid pattern
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var hex = document.createElement('div');
        hex.className = 'hexagon';
        
        // offset every other row for honeycomb pattern
        var offsetX = (row % 2) * (hexSize / 2 + hexSpacing / 2);
        var x = col * (hexSize + hexSpacing) + offsetX - (hexSize / 2);
        var y = row * (hexSize * 0.866 + hexSpacing) - (hexSize / 2);
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        
        // Random animation delay for staggered effect
        hex.style.animationDelay = (Math.random() * 3) + 's';
        
        bgContainer.appendChild(hex);
        
        // Mouse hover glow effect
        hex.addEventListener('mouseenter', function() {
          this.classList.add('hex-glow');
        });
        
        hex.addEventListener('mouseleave', function() {
          this.classList.remove('hex-glow');
        });
      }
    }
  }
  
  function initHexagonBackground() {
    // Create the background container only once
    bgContainer = document.querySelector('.hex-background');
    if (!bgContainer) {
      bgContainer = document.createElement('div');
      bgContainer.className = 'hex-background';
      document.body.insertBefore(bgContainer, document.body.firstChild);
    }
    
    createHexagons();

    // Resize handler to regenerate hexagons if window size changes
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        createHexagons();
      }, 250);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHexagonBackground);
  } else {
    initHexagonBackground();
  }
})();
