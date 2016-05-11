var collapsed, expanded, toggleSidebar;

collapsed = 'page-sidebar-collapsed';

expanded = 'page-sidebar-expanded';

toggleSidebar = function() {
  $('.page-with-sidebar').toggleClass(collapsed + " " + expanded);
  $('header').toggleClass("header-collapsed header-expanded");
  $('.toggle-nav-collapse i').toggleClass("fa-angle-right fa-angle-left");

  return setTimeout((function() {
    var niceScrollBars;
    niceScrollBars = $('.nicescroll').niceScroll();
    return niceScrollBars.updateScrollBar();
  }), 300);
};

$(document).on("click", '.toggle-nav-collapse', function(e) {
  e.preventDefault();
  return toggleSidebar();
});

$(window).on('resize', function(){
  var size;
  size = bp.getBreakpointSize();
  if (size === "xs" || size === "sm") {
    if ($('.page-with-sidebar').hasClass(expanded)) {
      return toggleSidebar();
    }
  }
});
