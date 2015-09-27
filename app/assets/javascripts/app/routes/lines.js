//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'lines',

    controller: ['service', '$injector',
      function(service, $injector) {
        mohican.extendResourcePageController('lines', this, service, $injector);
        var ctrl = this;

        ctrl.onItemSelect = function(selectedItems) {
          console.log(selectedItems);
        };
        ctrl.popup = function(/*clickedItem, selectedItems*/) {
          var retArray = [/*
            {
              text:   'pop me up',
              action: function() {
                ctrl.clickedItem = clickedItem;
                ctrl.selectedItems = selectedItems;
                ctrl.popDialog('Selected Orders', 'app/routes/activities-example-dialog.html');
              }
            }
          */];
          return retArray;
        };
        ctrl.cellsDrv = ctrl.createSubDocsBasicDriver($injector, 'production_cells', [
          {
            header: 'Name',
            name: 'name',
            view: 'text',
            width: 200
          }
        ]);
      }
    ],

    service: ['$http', '$q', function ($http, $q) {
      var service = mohican.constructBaseService('lines', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
