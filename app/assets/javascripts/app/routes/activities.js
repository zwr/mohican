//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'activities',

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

        ctrl.handlersDrv = ctrl.createSubDocsBasicDriver($injector, 'handlers', [
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
        ctrl.productsDrv = ctrl.createSubDocsBasicDriver($injector, 'products', [
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
                ctrl.popDialog('Selected Orders', 'app/routes/activities-example-dialog.html');
              }
            },
            {
              text:   'link to activity',
              action: function() {
                ctrl.linkToActivityController = {};
                mohican.extendResourceDriver(ctrl.linkToActivityController, service, $injector);
                ctrl.popDialog('Selected Orders', 'app/routes/activities-link-to-activity-dialog.html');
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
      var service = mohican.constructBaseService('activities', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
}]);
