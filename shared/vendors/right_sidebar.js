window.Sidebar = (function() {
  function Sidebar(currentUser) {
    this.addEventListeners();
  }

  Sidebar.prototype.addEventListeners = function() {
    $('aside').on('click', '.sidebar-collapsed-icon', this.sidebarCollapseClicked);
    $('.dropdown').on('hidden.gl.dropdown', this.sidebarDropdownHidden);
    $('.dropdown').on('loading.gl.dropdown', this.sidebarDropdownLoading);
    return $('.dropdown').on('loaded.gl.dropdown', this.sidebarDropdownLoaded);
  };

  Sidebar.prototype.sidebarDropdownLoading = function(e) {
    var $loading, $sidebarCollapsedIcon, i, img;
    $sidebarCollapsedIcon = $(this).closest('.block').find('.sidebar-collapsed-icon');
    img = $sidebarCollapsedIcon.find('img');
    i = $sidebarCollapsedIcon.find('i');
    $loading = $('<i class="fa fa-spinner fa-spin"></i>');
    if (img.length) {
      img.before($loading);
      return img.hide();
    } else if (i.length) {
      i.before($loading);
      return i.hide();
    }
  };

  Sidebar.prototype.sidebarDropdownLoaded = function(e) {
    var $sidebarCollapsedIcon, i, img;
    $sidebarCollapsedIcon = $(this).closest('.block').find('.sidebar-collapsed-icon');
    img = $sidebarCollapsedIcon.find('img');
    $sidebarCollapsedIcon.find('i.fa-spin').remove();
    i = $sidebarCollapsedIcon.find('i');
    if (img.length) {
      return img.show();
    } else {
      return i.show();
    }
  };

  Sidebar.prototype.sidebarCollapseClicked = function(e) {
    var $block, $editLink;
    e.preventDefault();
    $block = $(this).closest('.block');
    $('aside').find('.gutter-toggle').trigger('click');
    $editLink = $block.find('.edit-link');
    if ($editLink.length) {
      $editLink.trigger('click');
      $block.addClass('collapse-after-update');
      return $('.page-with-sidebar').addClass('with-overlay');
    }
  };

  Sidebar.prototype.sidebarDropdownHidden = function(e) {
    var $block;
    $block = $(this).closest('.block');
    if ($block.hasClass('collapse-after-update')) {
      $block.removeClass('collapse-after-update');
      $('.page-with-sidebar').removeClass('with-overlay');
      return $('aside').find('.gutter-toggle').trigger('click');
    }
  };

  return Sidebar;
})();
