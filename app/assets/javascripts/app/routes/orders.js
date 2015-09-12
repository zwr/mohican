//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'orders',

    controller: ['service', '$injector', 'mnRouter',
      function(service, $injector, mnRouter) {
        mohican.extendResourcePageController('orders', this, service, $injector);
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
          ctrl.refResourceController = {};
          var usersService = $injector.get('usersService');
          mohican.extendResourceDriver(ctrl.refResourceController, usersService, $injector);
          ctrl.popDialog('Select from users',
                                'mohican/directives/mnf-reference-grid/ref-resource-dialog.html',
                                { hideFooter: true }).
                      then(function(selectedItems) {
                        if(selectedItems.length > 0) {
                          var userRef = selectedItems[0][ctrl.refResourceController.primaryKeyName];
                          var userName = selectedItems[0]['name'];

                          var newItem = {
                            'user_ref':  userRef,
                            'user_name': userName
                          };
                          service.addNewSubDoc($injector.get('$q'), ctrl.itemForm, 'order_handlers', newItem);
                        }
                      });
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
            readOnly:       true
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
          ctrl.refResourceController = {};
          var productsService = $injector.get('productsService');
          mohican.extendResourceDriver(ctrl.refResourceController, productsService, $injector);
          ctrl.popDialog('Select from products',
                                'mohican/directives/mnf-reference-grid/ref-resource-dialog.html',
                                { hideFooter: true }).
                      then(function(selectedItems) {
                        if(selectedItems.length > 0) {
                          var productRef = selectedItems[0][ctrl.refResourceController.primaryKeyName];
                          var productName = selectedItems[0]['name'];

                          var newItem = {
                            'product_ref':  productRef,
                            'product_name': productName,
                            'quantity':     1
                          };
                          service.addNewSubDoc($injector.get('$q'), ctrl.itemForm, 'order_items', newItem);
                        }
                      });
        };

        ctrl.commitSuccess = function(mnfDoc) {
          mnRouter.transitionTo(mnRouter.currentRouteDoc(), {
            itemPrimaryKeyId: mnfDoc._mnid
          });
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
