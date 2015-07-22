(function(mohican) {
  'use strict';

  mohican.validatePageParameter = function(page, pageCount, mnRouter) {
    if(isNaN(page.toString()) || page < 1 || (page > pageCount && pageCount > 0)) {
      mnRouter.pageNotFound();
    }
    else {
      return true;
    }
    return false;
  };

  mohican.validateLayoutParameter = function(layout, layouts, mnRouter) {
    var isInList = false;
    layouts.forEach(function(lout) {
      if(layout === lout.name) {
        isInList = true;
        return;
      }
    });

    if(isInList) {
      return true;
    }
    else {
      mnRouter.pageNotFound();
    }
    return false;
  };

  mohican.validateBackendFilterParameter = function(backendFilter, backendFilters, mnRouter) {
    var isInList = false;
    backendFilters.forEach(function(fter) {
      if(backendFilter === fter.name) {
        isInList = true;
        return;
      }
    });

    if(isInList) {
      return true;
    }
    else {
      mnRouter.pageNotFound();
    }
    return false;
  };

}(window.mohican));
