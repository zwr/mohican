//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'activities',

    controller: ['service', 'mnRouter',
      function(service, mnRouter) {
        mohican.extendResourcePageController(this, service, mnRouter);
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
        ctrl.CurrentItemProductsController = {};
        var productsGridFields = [
          {
            header: 'EAN',
            name:   'ean',
            view:   'text',
            width:  150
          },
          {
            header: 'Name',
            name:   'name',
            view:   'text',
            width:  600
          }
        ];
        var onCurrItemCalback = mohican.extendBasicDriver(ctrl.CurrentItemProductsController, 'products', productsGridFields);
        ctrl.onCurrentItemChanged.push(onCurrItemCalback);

        ctrl.onItemSelect = function(selectedItems) {
          console.log(selectedItems);
        };
        ctrl.popup = function(clickedItem, selectedItems) {
          console.log('Clicked Item: ', clickedItem);
          console.log('Selected Items: ', selectedItems);
          var retArray = [
            {
              text:   'pop me up',
              action: function() {
                ctrl.clickedItem = clickedItem;
                ctrl.selectedItems = selectedItems;
                ctrl.popDialog('Selected Orders', 'app/routes/activities-example-dialog.html');
              }
            },
            {
              text:   'link to activity',
              action: function() {
                ctrl.linkToActivityController = {};
                mohican.extendResourceDriver(ctrl.linkToActivityController, service);
                ctrl.popDialog('Selected Orders', 'app/routes/activities-link-to-activity-dialog.html');
              }
            },
            {
              text:   'second action',
              action: function() {
                console.log('second action exec on object ' + clickedItem.WorkOrder_ID);
              }
            }
          ];
          return retArray;
        };
      }
    ],

    service: ['$http', '$q', function ($http, $q) {
      var service = mohican.constructBaseService('activities', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
