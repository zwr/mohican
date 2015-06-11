//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'activities',

    controller: ['service', 'mnRouter',
      function(service, mnRouter) {
        mohican.extendBaseController(this, service, mnRouter);
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
      mohican.extendBaseService(service, 'activities', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
