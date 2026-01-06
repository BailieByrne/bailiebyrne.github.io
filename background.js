// Animated hexagon background with glow effect on hover canvas-based for performance
(function() {
  var canvas = null;
  var ctx = null;
  var hexagons = [];
  var hoveredHex = null;
  var animationFrame = null;
  
  // hexagon configuration
  var hexSize = 80;
  var hexSpacing = 10;
  
  function drawHexagon(x, y, size, strokeColor, lineWidth, fillColor) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i;
      var hx = x + size * Math.cos(angle);
      var hy = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }
    ctx.closePath();
    
    // Fill if color provided
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  
  function createHexagonData() {
    hexagons = [];
    var rows = Math.ceil(window.innerHeight / (hexSize + hexSpacing)) + 2;
    var cols = Math.ceil(window.innerWidth / (hexSize + hexSpacing)) + 2;
    
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var offsetX = (row % 2) * (hexSize / 2 + hexSpacing / 2);
        var x = col * (hexSize + hexSpacing) + offsetX;
        var y = row * (hexSize * 0.866 + hexSpacing);
        
        hexagons.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          phase: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          speed: 0.0008 + Math.random() * 0.0004,
          amplitude: 3 + Math.random() * 5
        });
      }
    }
  }
  
  function getHexagonAtPoint(mx, my) {
    for (var i = 0; i < hexagons.length; i++) {
      var hex = hexagons[i];
      var dx = mx - hex.x;
      var dy = my - hex.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < hexSize * 0.6) {
        return hex;
      }
    }
    return null;
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var time = Date.now();
    
    for (var i = 0; i < hexagons.length; i++) {
      var hex = hexagons[i];
      
      // Animated position with sine waves for organic floating
      var offsetX = Math.sin(time * hex.speed + hex.phase) * hex.amplitude;
      var offsetY = Math.cos(time * hex.speed * 0.7 + hex.phaseY) * hex.amplitude * 0.8;
      hex.x = hex.baseX + offsetX;
      hex.y = hex.baseY + offsetY;
      
      var opacity = 0.15 + Math.sin(time * hex.speed + hex.phase) * 0.1;
      
      // Draw normal or hovered hexagon
      if (hoveredHex === hex) {
        // Purple hover effect with fill
        drawHexagon(hex.x, hex.y, hexSize * 0.45, 'rgba(95, 53, 232, 0.1)', 2, 'rgba(146, 51, 234, 0.1)');
      } else {
        // Normal blue hexagon
        var color = 'rgba(57, 197, 255, ' + opacity + ')';
        drawHexagon(hex.x, hex.y, hexSize * 0.45, color, 1.5);
      }
    }
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  function initHexagonBackground() {
    // Create canvas element
    canvas = document.querySelector('.hex-background');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'hex-background';
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexagonData();
    }
    
    resizeCanvas();
    
    // Mouse move handler for hover effect
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      hoveredHex = getHexagonAtPoint(mx, my);
    });
    
    canvas.addEventListener('mouseleave', function() {
      hoveredHex = null;
    });
    
    // Resize handler
    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 250);
    });
    
    // Start animation
    animate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHexagonBackground);
  } else {
    initHexagonBackground();
  }
})();
