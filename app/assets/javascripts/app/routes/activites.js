//= require_self

(function(MohicanUtils) {
  'use strict';
  angular.module('id5').
          config(['mnRouterProvider', function(mnRouter) {
            mnRouter.addResouceRoute({
              name: 'activities',

              controller: ['service', '$stateParams', '$state', '$scope',
                function(resolve, $stateParams, $state, $scope) {
                  MohicanUtils.extendBaseController(this, resolve, $stateParams, $state, $scope);
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
