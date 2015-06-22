//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addResouceRoute({
    name: 'activities',

    controller: ['service', 'mnRouter', 'ngDialog',
      function(service, mnRouter, ngDialog) {
        mohican.extendBaseController(this, service, mnRouter);
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
        ctrl.editItem = function (item) {
          console.log(item);
          ngDialog.open({
            template:        'editItemForm',
            closeByDocument: false,
            controller:      [function() {
              var vm = this;
              vm.item = item;
            }],
            controllerAs: 'editItem'
          });
        };
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
                ctrl.popDialog('app/routes/activitiesExampleDialog.html');
              }
            },
            {
              text:   'first action',
              action: function() {
                console.log('first action exec on object ' + clickedItem.WorkOrder_ID);
              }
            },
            {
              text:   'second action',
              action: function() {
                console.log('second action exec on object ' + clickedItem.WorkOrder_ID);
              }
            }
          ];

          for(var i = 0; i < Math.floor(Math.random() * 10); i++) {
            retArray.push({
              text:   'action' + i,
              action: function() {
                console.log('first action exec' + i + ' on object ' + clickedItem.WorkOrder_ID);
              }
            });
          }
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
