(function(mohican) {
  'use strict';

  mohican.validatePageParameter = function(page, pageCount, state, params) {
    if(isNaN(page.toString()) || page < 1 || (page > pageCount && pageCount > 0)) {
      var newRouteParams = _.clone(params);
      newRouteParams.page = '1';
      state.go(state.current.name, mohican.escapeDefaultParameters(newRouteParams));
    }
    else {
      return true;
    }
    return false;
  };

  mohican.validateLayoutParameter = function(layout, layouts, state, params) {
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
      state.go(state.current.name, mohican.escapeDefaultParameters(newRouteParams));
    }
    return false;
  };

  mohican.validateBackendFilterParameter = function(backendFilter, backendFilters, state, params) {
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
      var newRouteParams = _.clone(params);
      newRouteParams.backendfilter = 'default';
      state.go(state.current.name, mohican.escapeDefaultParameters(newRouteParams));
    }
    return false;
  };

}(window.mohican));
