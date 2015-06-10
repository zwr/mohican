//= require_self

(function(MohicanUtils) {
  'use strict';
  angular.module('id5').
          config(['mnRouterProvider', function(mnRouterProvider) {
            mnRouterProvider.addResouceRoute({
              name: 'activities',

              controller: ['service', 'mnRouter',
                function(resolve, mnRouter) {
                  MohicanUtils.extendBaseController(this, resolve, mnRouter);
                }
              ],

              service: ['$http', '$q', function ($http, $q) {
                var service = {};
                MohicanUtils.extendBaseService(service, 'activities', $http, $q);
                // do a lot of stuff
                return service;
              }]
            });
          }]);
})(window.MohicanUtils);
