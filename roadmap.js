// Road Map component with pan, zoom (clamped), and draggable circular nodes
(function () {
  function initRoadMap() {
    var roadMap = document.getElementById('road-map');
    if (!roadMap) {
      roadMap = document.createElement('section');
      roadMap.id = 'road-map';
      roadMap.setAttribute('aria-label', 'Road Map');
      document.body.insertBefore(roadMap, document.body.firstChild);
    }

    // Clear and build stage/content container
    roadMap.innerHTML = '';
    var content = document.createElement('div');
    content.className = 'road-map-content';
    roadMap.appendChild(content);
    // Edge layer (SVG) under nodes
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.overflow = 'visible';
    svg.style.pointerEvents = 'none';
    content.appendChild(svg);

    var nodes = {};
    var edges = [];
    var NODE_SIZE = 160; // matches CSS

    function createNode(name, x, y, subtitle) {
      var el = document.createElement('div');
      el.className = 'road-node';
      el.dataset.name = name;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      
      var titleEl = document.createElement('div');
      titleEl.className = 'road-node-title';
      titleEl.textContent = name;
      el.appendChild(titleEl);
      
      if (subtitle) {
        var subtitleEl = document.createElement('div');
        subtitleEl.className = 'road-node-subtitle';
        subtitleEl.textContent = subtitle;
        el.appendChild(subtitleEl);
      }
      
      content.appendChild(el);
      nodes[name] = { name: name, el: el, x: x, y: y };

      // Click to open modal
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        showNodeModal(name);
      });

      return nodes[name];
    }

    function showNodeModal(nodeName) {
      var overlay = document.createElement('div');
      overlay.className = 'roadmap-modal-overlay';
      var modal = document.createElement('div');
      modal.className = 'roadmap-modal';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'roadmap-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = function () { overlay.remove(); };

      // Pre-rendered structure for each node
      var titleDiv = document.createElement('div');
      titleDiv.className = 'roadmap-modal-title-container';
      var title = document.createElement('h2');
      title.className = 'roadmap-modal-title';
      titleDiv.appendChild(title);

      var contentDiv = document.createElement('div');
      contentDiv.className = 'roadmap-modal-content-container';
      
      var descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'roadmap-modal-description';
      descriptionDiv.style.textDecoration = 'underline';
      descriptionDiv.style.whiteSpace = 'pre-wrap';
      contentDiv.appendChild(descriptionDiv);

      var detailsDiv = document.createElement('div');
      detailsDiv.className = 'roadmap-modal-details';
      detailsDiv.style.fontStyle = 'italic';
      detailsDiv.style.color = '#888';
      detailsDiv.style.marginTop = '1rem';
      detailsDiv.style.lineHeight = '1.6';
      detailsDiv.style.whiteSpace = 'pre-wrap';
      contentDiv.appendChild(detailsDiv);

      var metadataDiv = document.createElement('div');
      metadataDiv.className = 'roadmap-modal-metadata';
      metadataDiv.style.marginTop = '1rem';
      metadataDiv.style.fontWeight = 'bold';
      metadataDiv.style.textShadow = '0 0 10px currentColor';
      contentDiv.appendChild(metadataDiv);

      // Hardcoded the data for each node (No need to dynamicise anymore)
      switch(nodeName) {
        case 'Wolverley':
          title.textContent = 'Wolverley';
          descriptionDiv.textContent = 'My secondary education';
          detailsDiv.textContent = 'GCSEs';
          metadataDiv.textContent = '2017-2022';
          metadataDiv.style.color = '#888';
          break;
        case 'King Edward VI':
          title.textContent = 'King Edward VI';
          descriptionDiv.textContent = '#1 Ranked College In Worcestershire.';
          detailsDiv.textContent = 'Achieved my A-Levels in: \nComputer Science\nMaths\nPhysics\n';
          metadataDiv.textContent = 'Completed';
          metadataDiv.style.color = '#22c55e';
          break;
        case 'University of Liverpool':
          title.textContent = 'University of Liverpool';
          descriptionDiv.textContent = 'BSc Computer Science with Software Development with Industrial Year';
          detailsDiv.textContent = 'Recieved 1st Class Average for 1st Year (80%)';
          metadataDiv.textContent = '2024-2028';
          metadataDiv.style.color = '#888';
          break;
        case 'Placement Year':
          title.textContent = 'Placement Year';
          descriptionDiv.textContent = 'Industrial placement year';
          detailsDiv.textContent = 'Year in industry';
          metadataDiv.textContent = '2026-2027';
          metadataDiv.style.color = '#888';
          break;
        case 'Python MMORPG':
          title.textContent = 'Python MMORPG';
          descriptionDiv.textContent = 'University group project';
          detailsDiv.textContent = 'Multiplayer online game';
          metadataDiv.textContent = 'Completed';
          metadataDiv.style.color = '#22c55e';
          break;
        case 'Java Banking app':
          title.textContent = 'Java Banking app';
          descriptionDiv.textContent = 'University coursework';
          detailsDiv.textContent = 'Banking application';
          metadataDiv.textContent = 'Completed';
          metadataDiv.style.color = '#22c55e';
          break;
        case 'BAE Systems Air':
          title.textContent = 'BAE Systems Air';
          descriptionDiv.textContent = 'Summer internship';
          detailsDiv.textContent = 'During my time at BAE, I was integrated into the MIDAS (Mission Director and Autonomy Systems) team.  \n \nThis was comprised of many software and systems engineers, exposing me to the full SDLC lifecycle.  \n \nI worked on mission-critical software aligned to UK MoD standards, contributing to autonomy systems for unmanned aerial vehicles amongst other projects. \n \nThis experience solidified my interest in defence software engineering and provided invaluable industry insight.';
          metadataDiv.textContent = 'Completed';
          metadataDiv.style.color = '#22c55e';
          break;
        case 'BAE Systems Naval':
          title.textContent = 'BAE Systems Naval';
          descriptionDiv.textContent = 'Placement Year Offer';
          detailsDiv.textContent = 'Following from my prior history at BAE Systems I was gratefully offered a position at their New Malden location to work in their Naval Software Engineering team. \n \nHowever after careful consideration, factors including relocation costs to high expense areas made other offers more feasible.';
          metadataDiv.textContent = 'Declined';
          metadataDiv.style.color = '#ef4444';
          break;
        case 'CGI Inc':
          title.textContent = 'CGI Inc';
          descriptionDiv.textContent = 'Placement Year Offer';
          detailsDiv.textContent = 'Often referred to as #5 globally for IT and business consulting services, CGI Inc provided a highly appealing placement opportunity. \n \nAfter progressing through multiple rigorous interview stages, I was delighted to receive an offer to join their graduate placement scheme for my industrial year. \n \nThe role promises exposure to diverse projects and professional growth within a leading global firm.';
          metadataDiv.textContent = 'Accepted Offer';
          metadataDiv.style.color = '#22c55e';
          break;
        default:
          title.textContent = nodeName;
          descriptionDiv.textContent = 'Error: No data available for this node.';
          detailsDiv.textContent = 'Please contact Bailie Byrne to report.';
          metadataDiv.textContent = 'If possible take a snapshot of your HTML in your browsers console for debugging.';
          metadataDiv.style.color = '#ff0000ff';
      }

      modal.appendChild(closeBtn);
      modal.appendChild(titleDiv);
      modal.appendChild(contentDiv);
      overlay.appendChild(modal);

      overlay.onclick = function (e) {
        if (e.target === overlay) overlay.remove();
      };

      document.body.appendChild(overlay);
    }

    function nodeCenter(n) {
      return { cx: n.x + NODE_SIZE / 2, cy: n.y + NODE_SIZE / 2 };
    }

    function createEdge(fromName, toName) {
      var from = nodes[fromName];
      var to = nodes[toName];
      if (!from || !to) return null;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      var a = nodeCenter(from);
      var b = nodeCenter(to);
      line.setAttribute('x1', a.cx);
      line.setAttribute('y1', a.cy);
      line.setAttribute('x2', b.cx);
      line.setAttribute('y2', b.cy);
      line.setAttribute('class', 'road-edge');
      svg.appendChild(line);
      var edge = { line: line, from: fromName, to: toName };
      edges.push(edge);
      return edge;
    }

    function updateEdge(edge) {
      var from = nodes[edge.from];
      var to = nodes[edge.to];
      var a = nodeCenter(from);
      var b = nodeCenter(to);
      edge.line.setAttribute('x1', a.cx);
      edge.line.setAttribute('y1', a.cy);
      edge.line.setAttribute('x2', b.cx);
      edge.line.setAttribute('y2', b.cy);
    }

    function updateEdgesFor(name) {
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (e.from === name || e.to === name) updateEdge(e);
      }
    }

    function resizeSvgToFitNodes() {
      var maxX = 0, maxY = 0;
      Object.keys(nodes).forEach(function (k) {
        var n = nodes[k];
        if (n.x + NODE_SIZE > maxX) maxX = n.x + NODE_SIZE;
        if (n.y + NODE_SIZE > maxY) maxY = n.y + NODE_SIZE;
      });
      var pad = 200;
      svg.setAttribute('width', Math.max(roadMap.clientWidth, maxX + pad));
      svg.setAttribute('height', Math.max(roadMap.clientHeight, maxY + pad));
    }

    // Interaction state
    var scale = 1.06;
    var MIN_SCALE = 0.5;
    var MAX_SCALE = 2.0;
    var panX = 75;
    var panY = -119;
    var isPanning = false;
    var lastPointerX = 0;
    var lastPointerY = 0;
    var autoCenter = true; // recenters on resize until user interacts

    var draggingNode = null;
    var dragStartX = 0;
    var dragStartY = 0;
    var nodeStartLeft = 0;
    var nodeStartTop = 0;

    // Touch pinch-zoom support
    var touchPoints = {};
    var lastTouchDistance = 0;

    function applyTransform() {
      content.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    }

    function centerOnNodeEl(targetNodeEl) {
      var vw = roadMap.clientWidth;
      var vh = roadMap.clientHeight;
      var nx = parseFloat(targetNodeEl.style.left) || 0;
      var ny = parseFloat(targetNodeEl.style.top) || 0;
      var nw = targetNodeEl.offsetWidth;
      var nh = targetNodeEl.offsetHeight;
      panX = (vw / 2) - (nw / 2) - nx;
      panY = (vh / 2) - (nh / 2) - ny;
      applyTransform();
    }

    // Build graph layout
    var baseY = 200;     // vertical baseline
    var stepX = 320;     // horizontal spacing between main-line nodes
    var branchDX = 160;  // branch horizontal offset
    var branchDY = 180;  // branch vertical offset

    var nWolverley = createNode('Wolverley', 0 * stepX, baseY, 'High School');
    var nKingEdward = createNode('King Edward VI', 1 * stepX, baseY, 'College');
    var nUni = createNode('University of Liverpool', 2 * stepX, baseY, 'University');
    var nPlacement = createNode('Placement Year', 3 * stepX, baseY, 'University');

    var nPythonMMO = createNode('Python MMORPG', 1 * stepX + branchDX, baseY - branchDY, 'Project');
    var nBanking = createNode('Java Banking app', 2 * stepX + branchDX, baseY - branchDY, 'Project');
    var nBAEAir = createNode('BAE Systems Air', 2 * stepX + branchDX, baseY + branchDY, 'Internship');
    var nBAENaval = createNode('BAE Systems Naval', 3 * stepX + branchDX, baseY - branchDY, 'Placement Year');
    var nCGI = createNode('CGI Inc', 3 * stepX + branchDX, baseY + branchDY, 'Placement Year');

    // Status mapping: completed, declined, pending
    nPythonMMO.el.classList.add('completed');
    nBanking.el.classList.add('completed');
    nBAEAir.el.classList.add('completed');
    nBAENaval.el.classList.add('declined');
    nCGI.el.classList.add('pending');

    // Edges: main line left->right (flowing)
    var e1 = createEdge('Wolverley', 'King Edward VI');
    var e2 = createEdge('King Edward VI', 'University of Liverpool');
    var e3 = createEdge('University of Liverpool', 'Placement Year');
    e1.line.classList.add('flowing');
    e2.line.classList.add('flowing');
    e3.line.classList.add('flowing');

    // Branches with status colors and flowing animation
    var e4 = createEdge('King Edward VI', 'Python MMORPG');
    var e5 = createEdge('University of Liverpool', 'Java Banking app');
    var e6 = createEdge('University of Liverpool', 'BAE Systems Air');
    var e7 = createEdge('Placement Year', 'BAE Systems Naval');
    var e8 = createEdge('Placement Year', 'CGI Inc');
    
    e4.line.classList.add('flowing', 'completed');
    e5.line.classList.add('flowing', 'completed');
    e6.line.classList.add('flowing', 'completed');
    e7.line.classList.add('flowing', 'declined');
    e8.line.classList.add('flowing', 'pending');

    // Size SVG to cover all nodes/edges
    resizeSvgToFitNodes();
    // Initial load with preset zoom and pan values
    requestAnimationFrame(function () { applyTransform(); });

    //reset function to window for button click handler
    window.resetRoadMapView = function () {
      scale = 1.06;
      panX = 75;
      panY = -119;
      autoCenter = true;
      applyTransform();
    };

    // Panning on background/content
    function onPointerDown(e) {
      // Start panning if clicking the background or content (not a node)
      if (e.target === roadMap || e.target === content) {
        isPanning = true;
        autoCenter = false;
        roadMap.classList.add('panning');
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        roadMap.setPointerCapture && roadMap.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    }
    function onPointerMove(e) {
      if (isPanning) {
        var dx = e.clientX - lastPointerX;
        var dy = e.clientY - lastPointerY;
        panX += dx;
        panY += dy;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        applyTransform();
      }
    }
    function onPointerUp(e) {
      if (isPanning) {
        isPanning = false;
        roadMap.classList.remove('panning');
        roadMap.releasePointerCapture && roadMap.releasePointerCapture(e.pointerId);
      }
    }

    roadMap.addEventListener('pointerdown', onPointerDown);
    roadMap.addEventListener('pointermove', onPointerMove);
    roadMap.addEventListener('pointerup', onPointerUp);

    // Touch pinch-zoom support (mobile)
    function getTouchDistance(p1, p2) {
      var dx = p1.clientX - p2.clientX;
      var dy = p1.clientY - p2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getTouchCenterPoint(points) {
      var pointArray = Object.values(points);
      var sumX = 0, sumY = 0;
      pointArray.forEach(function(p) {
        sumX += p.clientX;
        sumY += p.clientY;
      });
      return {
        x: sumX / pointArray.length,
        y: sumY / pointArray.length
      };
    }

    roadMap.addEventListener('pointerdown', function(e) {
      touchPoints[e.pointerId] = e;
      lastTouchDistance = 0;
    });

    roadMap.addEventListener('pointermove', function(e) {
      if (touchPoints[e.pointerId]) {
        touchPoints[e.pointerId] = e;
      }
      
      // Handle pinch-zoom with 2+ touch points
      var pointArray = Object.values(touchPoints);
      if (pointArray.length >= 2) {
        var p1 = pointArray[0];
        var p2 = pointArray[1];
        var currentDistance = getTouchDistance(p1, p2);
        
        if (lastTouchDistance > 0) {
          var factor = currentDistance / lastTouchDistance;
          var center = getTouchCenterPoint(touchPoints);
          var rect = roadMap.getBoundingClientRect();
          var csx = center.x - rect.left;
          var csy = center.y - rect.top;
          var c0x = (csx - panX) / scale;
          var c0y = (csy - panY) / scale;

          var newScale = scale * factor;
          if (newScale < MIN_SCALE) newScale = MIN_SCALE;
          if (newScale > MAX_SCALE) newScale = MAX_SCALE;

          panX = csx - c0x * newScale;
          panY = csy - c0y * newScale;
          scale = newScale;
          autoCenter = false;
          applyTransform();
        }
        lastTouchDistance = currentDistance;
      }
    });

    roadMap.addEventListener('pointerup', function(e) {
      delete touchPoints[e.pointerId];
      lastTouchDistance = 0;
    });

    roadMap.addEventListener('pointercancel', function(e) {
      delete touchPoints[e.pointerId];
      lastTouchDistance = 0;
    });

    // Node dragging is handled per-node within createNode; background pan below

    // Wheel zoom (clamped), zoom towards cursor
    roadMap.addEventListener('wheel', function (e) {
      e.preventDefault();
      var rect = roadMap.getBoundingClientRect();
      var csx = e.clientX - rect.left;
      var csy = e.clientY - rect.top;
      // Content coords under cursor before zoom
      var c0x = (csx - panX) / scale;
      var c0y = (csy - panY) / scale;

      var factor = Math.exp(-e.deltaY * 0.001); // smooth zoom
      var newScale = scale * factor;
      if (newScale < MIN_SCALE) newScale = MIN_SCALE;
      if (newScale > MAX_SCALE) newScale = MAX_SCALE;

      // Adjust pan so the point under cursor stays fixed
      panX = csx - c0x * newScale;
      panY = csy - c0y * newScale;
      scale = newScale;
      autoCenter = false;
      applyTransform();
    }, { passive: false });

    // Resize handling - keep viewport sized; recenter if no user interactions
    function onResize() {
      resizeSvgToFitNodes();
      if (autoCenter) centerOnNodeEl(nWolverley.el);
      else applyTransform();
    }
    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoadMap);
  } else {
    initRoadMap();
  }
})();
