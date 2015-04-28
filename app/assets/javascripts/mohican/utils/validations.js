(function(MohicanUtils) {
  'use strict';

  MohicanUtils.checkPageParameter = function(page, pagesCount, state, params) {
    if(isNaN(page.toString()) || page < 1 || page > pagesCount) {
      var newRouteParams = _.clone(params);
      newRouteParams.page = '1';
      state.go(state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    }
    else {
      return true;
    }
    return false;
  };

  MohicanUtils.checkLayoutParameter = function(layout, layouts, state, params) {
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
      var newRouteParams = _.clone(params);
      newRouteParams.layout = 'default';
      state.go(state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    }
    return false;
  };

}(window.MohicanUtils));
