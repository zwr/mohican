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
                  var ctrl = this;
                  ctrl.reportLocation = '/reports';
                  ctrl.attached = false;
                  ctrl.printMe = function(item) {
                    console.log(item);
                    angular.element('#printf').attr('src', '/id.pdf');
                    if(!ctrl.attached) {
                      ctrl.attached = true;
                      angular.element('#print-f').load(function() {
                        window.frames['print-f'].focus();
                        window.frames['print-f'].print();
                      });
                    }
                  };
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
