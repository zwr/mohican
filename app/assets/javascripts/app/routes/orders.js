//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'orders',

    controller: ['$modal', 'service', 'mnRouter',
      function($modal, service, mnRouter) {
        mohican.extendResourcePageController(this, service, mnRouter);
        var ctrl = this;
        ctrl.modal = $modal;
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

        ctrl.handlersDrv = ctrl.createBasicDriver('order_handlers', [
          {
            header:         'Name',
            name:           'user_name',
            view:           'reference',
            refId:          'user_ref',
            refResource:    'users',
            refFieldSource: ['name', 'gender'],
            width:          200
          }
        ]);
        ctrl.productsDrv = ctrl.createBasicDriver('order_items', [
          {
            header:         'Name',
            name:           'product_name',
            view:           'reference',
            refId:          'product_ref',
            refResource:    'products',
            refFieldSource: ['name'],
            width:          350
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
        ctrl.popup = function(clickedItem, selectedItems) {
          var retArray = [
            {
              text:   'pop me up',
              action: function() {
                ctrl.clickedItem = clickedItem;
                ctrl.selectedItems = selectedItems;
                ctrl.popDialog('Selected Orders', 'app/routes/orders-example-dialog.html');
              }
            },
            {
              text:   'link to order',
              action: function() {
                ctrl.linkToOrderController = {};
                mohican.extendResourceDriver(ctrl.linkToOrderController, service);
                ctrl.popDialog('Selected Orders', 'app/routes/orders-link-to-order-dialog.html');
              }
            },
            {
              text:   'select all',
              action: function(gridCtrl) {
                gridCtrl.selectAll();
              }
            },
            {
              text:   'select none',
              action: function(gridCtrl) {
                gridCtrl.selectNone();
              }
            }
          ];
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
