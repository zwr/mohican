//= require ./service
//= require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('activities', function ActivitiesController(resolve, $stateParams) {
    var ctrl = this;

    $stateParams = mnUtil.mnStateParameters($stateParams);

    ctrl.currentPage = $stateParams.page;

    ctrl.items = null;
    ctrl.pagesCount = 20;
    ctrl.layoutDefinitions = null;
    ctrl.fields = null;

    _getPage(ctrl.currentPage);
    resolve.getPageCount().then(function(pagesCount) {
      ctrl.pagesCount = pagesCount;
    });
    resolve.getLayoutDefinitions().then(function(layoutDefinitions) {
      ctrl.layoutDefinitions = layoutDefinitions;
      ctrl.fields = ctrl.layoutDefinitions.layouts[0].definition;
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
