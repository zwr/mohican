//= require ./service
//= require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('activities', function ActivitiesController(resolve, $stateParams, $state) {
    var ctrl = this;
    _initialize();

    function _initialize() {
      var initialParams = mnUtil.injectDefaultParameters($stateParams);

      ctrl.currentPage = initialParams.page;
      ctrl.layout = initialParams.layout;

      resolve.getPage(ctrl.currentPage).then(function(items) {
        ctrl.items = items;
      });

      resolve.getPageCount().then(function(pagesCount) {
        ctrl.pagesCount = pagesCount;
      });
      ctrl.layoutDefinitions = [];
      ctrl.layouts = [];
      resolve.getLayoutDefinitions().then(function(layoutDefinitions) {
        ctrl.layouts = layoutDefinitions.layouts;

        layoutDefinitions.layouts.forEach(function(layout) {
          ctrl.layoutDefinitions.push({
            name: layout.name,
            show: 'Layout: ' + layout.name,
            desc: 'Shows ' + layout.definition.length + ' fields',
            selected: layout.name === ctrl.layout,
          });
          if(layout.name === ctrl.layout) {
            ctrl.fields = layout.definition;
          }
        });
      });
    }

    function _getPage(page) {
      _validateParams($stateParams);
      var newRouteParams = _.clone($stateParams);
      newRouteParams.page = page.toString();
      $state.go($state.current.name, mnUtil.escapeDefaultParameters(newRouteParams));
    }

    function _getLayout(layout) {
      _validateParams($stateParams);
      var newRouteParams = _.clone($stateParams);
      newRouteParams.layout = layout;
      $state.go($state.current.name, mnUtil.escapeDefaultParameters(newRouteParams));
    }

    function _validateParams(params) {
      if (params.page <= 0) {
        params.page = 1;
      }
      if (params.page > ctrl.pagesCount) {
        params.page = ctrl.pagesCount;
      }
    }

    _.extend(ctrl, {
      getPage: _getPage,
      getLayout: _getLayout,
    });
  });
})(window.MohicanUtils);
