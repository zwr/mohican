//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'activities',

    controller: ['service', 'mnRouter', 'ngDialog',
      function(service, mnRouter, ngDialog) {
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
        ctrl.editItem = function (item) {
          console.log(item);
          ngDialog.open({
            template:        'editItem',
            closeByDocument: false,
            controller:      ['$scope', function($scope) {
              $scope.item = item;
            }]
          });
        };
      }
    ],

    service: ['$http', '$q', function ($http, $q) {
      var service = constructBaseService('activities', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
