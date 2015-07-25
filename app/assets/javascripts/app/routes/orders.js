//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'orders',

    controller: ['service', 'mnRouter',
      function(service, mnRouter) {
        mohican.extendResourcePageController(this, service, mnRouter);
        var ctrl = this;

        ctrl.handlersDrv = ctrl.createBasicDriver('handlers', [
          {
            header: 'Name',
            name:   'name',
            view:   'text',
            width:  150
          },
          {
            header: 'Address',
            name:   'address',
            view:   'text',
            width:  200
          },
          {
            header: 'Post Number',
            name:   'postno',
            view:   'text',
            width:  100
          },
          {
            header: 'City',
            name:   'city',
            view:   'text',
            width:  100
          }
        ]);
        ctrl.productsDrv = ctrl.createBasicDriver('order_items', [
          {
            header: 'Name',
            name:   'name',
            view:   'text',
            width:  100
          },
          {
            header: 'quantity',
            name:   'quantity',
            view:   'text',
            width:  100
          }
        ]);

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
      }
    ],

    service: ['$http', '$q', function ($http, $q) {
      var service = mohican.constructBaseService('orders', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
