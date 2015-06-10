//= require_self

(function(MohicanUtils) {
  'use strict';
  angular.module('id5').
          config(['mnRouterProvider', function(mnRouter) {
            mnRouter.addResouceRoute({name: 'start', controller: function() {}});
          }]);
})(window.MohicanUtils);
