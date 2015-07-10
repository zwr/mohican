(function(mohican) {
  'use strict';

  mohican.validatePageParameter = function(page, pageCount, mnRouter) {
    if(isNaN(page.toString()) || page < 1 || (page > pageCount && pageCount > 0)) {
      var newRouteParams = _.clone(mnRouter.$stateParams);
      newRouteParams.page = '1';
      mnRouter.transitionTo(mnRouter.$state.current.name, mohican.escapeDefaultParameters(newRouteParams));
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
      var newRouteParams = _.clone(mnRouter.$stateParams);
      newRouteParams.layout = 'default';
      mnRouter.transitionTo(mnRouter.$state.current.name, mohican.escapeDefaultParameters(newRouteParams));
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
      var newRouteParams = _.clone(mnRouter.$stateParams);
      newRouteParams.backendfilter = 'default';
      mnRouter.transitionTo(mnRouter.$state.current.name, mohican.escapeDefaultParameters(newRouteParams));
    }
    return false;
  };

}(window.mohican));
