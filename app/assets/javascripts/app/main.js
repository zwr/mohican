//= require_self
//= require_tree ./routes

(function(MohicanUtils) {
  'use strict';

  angular.module('id5', ['mohican']).
          config(['mnRouterProvider', '$urlRouterProvider', '$stateProvider', function(mnRouter, $urlRouterProvider, $stateProvider) {
              mnRouter.init($urlRouterProvider, $stateProvider);
            },
          ]).
          run(['mnRouter', function(mnRouter) {
            mnRouter.addResouceRoute({name: 'start', controller: function() {}});
            mnRouter.addResouceRoute({
              name: 'activities',
              controller: ['service', '$stateParams', '$state', '$scope',
                function(resolve, $stateParams, $state, $scope) {
                  _.assign(this, MohicanUtils.mnBaseController);
                  this.initialize(resolve, $stateParams, $state, $scope);
                  this.loadData();
                  this.reportLocation = '/reports';
                  this.attached = false;
                  this.printMe = function(item) {
                    console.log(item);
                    angular.element('#printf').attr('src', '/id.pdf');
                    if(!this.attached) {
                      this.attached = true;
                      angular.element('#print-f').load(function() {
                        window.frames['print-f'].focus();
                        window.frames['print-f'].print();
                      });
                    }
                  };
                }
              ],
              service: ['$http', '$q', function ($http, $q) {
                var service = MohicanUtils.mnBaseFactory('activities', $http, $q);
                // do a lot of stuff
                return service;
              }]
            });
          }]);
})(window.MohicanUtils);
