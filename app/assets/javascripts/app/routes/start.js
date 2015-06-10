//= require_self

(function(MohicanUtils) {
  'use strict';
  angular.module('id5').
          config(['mnRouterProvider', function(mnRouterProvider) {
            mnRouterProvider.addSimpleRoute({
              name:       'start',
              default:    true,
              controller: function() {}
            });
          }]);
})(window.MohicanUtils);
