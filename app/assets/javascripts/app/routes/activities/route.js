//= require ./service
//= require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('activities', function ActivitiesController(resolve) {
    var ctrl = this;

    ctrl.currentPage = 1;

    ctrl.items = null;
    ctrl.pagesCount = null;
    ctrl.layoutDefinitions = null;
    ctrl.fields = null;

    _getPage(ctrl.currentPage);
    resolve.getPageCount().then(function(pagesCount) {
      ctrl.pagesCount = pagesCount;
      // And this should be used by the footer controller,
      // which I have already made, so just steal it and make
      // it fit nice in to this new Mohican.
    });
    resolve.getLayoutDefinitions().then(function(layoutDefinitions) {
      ctrl.layoutDefinitions = layoutDefinitions;
      ctrl.fields = ctrl.layoutDefinitions.layouts[0].definition;
      // This contains layouts (two of them, default and short)
      // and it also contains empty lists of filters and sorts.
      // Ignore the other two, and use the first to draw a table.
    });

    function _getPage(page) {
      resolve.getPage(page).then(function(items) {
        ctrl.items = items;
        console.log(ctrl.items);
        // And now, if there is ng-repeat="item in items"
        // in the tempalte, magic will happen!
      });
    }

    _.extend(ctrl, {
      getPage: _getPage,
    });
  });
})(window.MohicanUtils);
