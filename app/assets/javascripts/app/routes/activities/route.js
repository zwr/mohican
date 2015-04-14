//= require ./service
//= require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('activities', function ActivitiesController(resolve) {
    var ctrl = this; // I think this is the scope, but it would be nicer
                 // to actually have it injected, and use $scope
                 // everywhere instead of this or ctrl.
    ctrl.myPageItems = null;
    ctrl.totalPageCount = null;
    ctrl.myCurrentPage = 3; // this you should read form the address bar
                            // and default value is 1
    ctrl.myLayoutDefinitions = null;
    resolve.getPage(ctrl.myCurrentPage)
      .then(function(pageItems) {
        ctrl.myPageItems = pageItems;
        // And now, if there is ng-repeat="item in myPageItems"
        // in the tempalte, magic will happen!
      });
      resolve.getPageCount()
      .then(function(pageCount) {
        ctrl.totalPageCount = pageCount;
        // And this should be used by the footer controller,
        // which I have already made, so just steal it and make
        // it fit nice in to this new Mohican.
      });
      resolve.getLayoutDefinitions()
      .then(function(layoutDefinitions) {
        ctrl.myLayoutDefinitions = layoutDefinitions;
        // This contains layouts (two of them, default and short)
        // and it also contains empty lists of filters and sorts.
        // Ignore the other two, and use the first to draw a table.
      });
    return ctrl;
  });
})(window.MohicanUtils);
