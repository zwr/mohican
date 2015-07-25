//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'orders',

    controller: ['service', 'mnRouter',
      function(service, mnRouter) {
        mohican.extendResourcePageController(this, service, mnRouter);
        var ctrl = this;

        ctrl.handlersDrv = ctrl.createBasicDriver('order_handlers', [
          {
            header: 'Name',
            name:   'user_name',
            view:   'text',
            width:  150
          }
        ]);
        console.log(ctrl);
        ctrl.productsDrv = ctrl.createBasicDriver('order_items', [
          {
            header: 'Name',
            name:   'product_name',
            view:   'text',
            width:  300
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
