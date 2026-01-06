// sliding navigation indicator that pans smoothly between tabs on hover
(function() {
  function initNavIndicator() {
    var navTabs = document.querySelector('.nav-tabs');
    var tabs = document.querySelectorAll('.tab');
    
    if (!navTabs || tabs.length === 0) return;
    
    // function to move the indicator to a specific tab
    function moveIndicator(tab) {
      var indicator = navTabs;
      var tabRect = tab.getBoundingClientRect();
      var containerRect = navTabs.getBoundingClientRect();
      
      // Calculate position relative to container
      var left = tabRect.left - containerRect.left;
      var width = tabRect.width;
      
      // Update the ::before pseudo element via CSS custom properties
      indicator.style.setProperty('--indicator-left', left + 'px');
      indicator.style.setProperty('--indicator-width', width + 'px');
      indicator.classList.add('has-indicator');
    }
    
    // hide indicator when not hovering
    function hideIndicator() {
      navTabs.classList.remove('has-indicator');
    }
    
    // attach hover listeners to each tab
    tabs.forEach(function(tab) {
      tab.addEventListener('mouseenter', function() {
        // Hide indicator on active tab, show it on others
        if (this.classList.contains('active')) {
          hideIndicator();
        } else {
          moveIndicator(this);
        }
      });
    });
    
    // Hide indicator when mouse leaves the nav tabs container
    navTabs.addEventListener('mouseleave', hideIndicator);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavIndicator);
  } else {
    initNavIndicator();
  }
})();
