//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'orders',

    controller: ['service', '$injector',
      function(service, $injector) {
        mohican.extendResourcePageController(this, service, $injector);
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

        ctrl.handlersDrv = ctrl.createSubDocsBasicDriver($injector, 'order_handlers', [
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
        ctrl.addNewHandler = function() {
          console.log('addNewHandler');
        };
        ctrl.productsDrv = ctrl.createSubDocsBasicDriver($injector, 'order_items', [
          {
            header:         'Name',
            name:           'product_name',
            view:           'reference',
            refId:          'product_ref',
            refResource:    'products',
            refFieldSource: ['name'],
            width:          350,
            readOnly:       false
          },
          {
            header:   'quantity',
            name:     'quantity',
            view:     'text',
            width:    100,
            readOnly: false
          }
        ]);
        ctrl.addNewProduct = function() {
          var newItem = {
            'product_ref':  '55e68ed6774539c26a6f286a',
            'product_name': 'Pirkka herkkusienileike 200g',
            'quantity':     1
          };
          service.addNewSubDoc($injector.get('$q'), ctrl.itemForm, 'order_items', newItem);
        };

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
                mohican.extendResourceDriver(ctrl.linkToOrderController, service, $injector);
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
