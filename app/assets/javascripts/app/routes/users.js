//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'users',

    controller: ['service', '$injector',
      function(service, $injector) {
        mohican.extendResourcePageController('users', this, service, $injector);
        var ctrl = this;

        ctrl.onItemSelect = function(selectedItems) {
          console.log(selectedItems);
        };
        ctrl.popup = function(/*clickedItem, selectedItems*/) {
          var retArray = [];
          return retArray;
        };
      }
    ],

    service: ['$http', '$q', 'mnNotify', function ($http, $q, mnNotify) {
      var service = mohican.constructBaseService('users', $http, $q, mnNotify);
      // do a lot of stuff
      return service;
    }]
  });
}]);
