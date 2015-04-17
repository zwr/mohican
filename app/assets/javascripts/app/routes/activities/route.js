//= require ./service
//= require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('activities', function ActivitiesController(resolve, $stateParams) {
    var ctrl = this;

    $stateParams = mnUtil.mnStateParameters($stateParams);

    ctrl.currentPage = $stateParams.page;
    ctrl.layout = $stateParams.layout;

    ctrl.items = null;
    ctrl.pagesCount = 20;
    ctrl.layoutDefinitions = [];
    ctrl.fields = null;

    _getPage(ctrl.currentPage);
    resolve.getPageCount().then(function(pagesCount) {
      ctrl.pagesCount = pagesCount;
    });
    resolve.getLayoutDefinitions().then(function(layoutDefinitions) {
      layoutDefinitions.layouts.forEach(function(layout) {
        ctrl.layoutDefinitions.push({
          name: layout.name,
          show: 'Layout: ' + layout.name,
          desc: 'Shows ' + layout.definition.length + ' fields',
          selected: layout.name === ctrl.layout,
        });
      });
      ctrl.fields = layoutDefinitions.layouts[0].definition;
    });

    function _getPage(page) {
      resolve.getPage(page).then(function(items) {
        ctrl.items = items;
        ctrl.currentPage = page;
      });
    }

    _.extend(ctrl, {
      getPage: _getPage,
    });
  });
})(window.MohicanUtils);
