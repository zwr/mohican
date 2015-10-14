//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';

  var resourceName = 'products';
  mnRouterProvider.addResouceRoute({
    routeName:    resourceName,
    resourceName: resourceName,

    controller: function(service, $injector) {
      mohican.extendResourcePageController(resourceName, this, service, $injector);
      var ctrl = this;

      ctrl.onItemSelect = function(selectedItems) {
        console.log(selectedItems);
      };
      ctrl.popup = function(/*clickedItem, selectedItems*/) {
        var retArray = [];
        return retArray;
      };
    },

    service: function($injector) {
      var service = mohican.constructBaseService(resourceName, $injector);
      // do a lot of stuff
      return service;
    }
  });
}]);
