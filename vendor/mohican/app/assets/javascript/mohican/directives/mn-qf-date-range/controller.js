//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnQfDateRangeController', ['$scope', '$timeout', MnQfDateRangeController]);

  function MnQfDateRangeController($scope, $timeout) {
    var vm = this;

    if(vm.model) {
      vm.dateRange = {
        startDate: vm.model.startDate,
        endDate:   vm.model.endDate
      };
    }
    else {
      vm.dateRange = {
        startDate: null,
        endDate:   null
      };
    }

    vm.dateRangeBefore = _.cloneDeep(vm.dateRange);

    $scope.$watch(function() { return vm.model; }, function (newValue) {
      if(angular.isUndefined(newValue)) {
        vm.dateRange = {
          startDate: null,
          endDate:   null
        };
      }
    });

    $scope.$watch(function() { return vm.dateRange; }, function (newValue, oldValue) {
      if(newValue !== oldValue) {
        if(!newValue || newValue.startDate === null || newValue.endDate === null) {
          vm.model = undefined;
        }
        else {
          vm.model = {
            startDate: newValue.startDate,
            endDate:   newValue.endDate
          };
        }
        $timeout(function() {
          vm.qfChanged({fieldName: vm.field.name}).then(function() {
            vm.dateRangeBefore = {
              startDate: vm.dateRange.startDate ? vm.dateRange.startDate.clone() : null,
              endDate:   vm.dateRange.endDate ? vm.dateRange.endDate.clone() : null
            };
          }, function() {
            if(vm.dateRangeBefore) {
              if(!vm.model) {
                vm.model = {};
              }
              vm.model.startDate = vm.dateRangeBefore.startDate;
              vm.model.endDate = vm.dateRangeBefore.endDate;
              if(!vm.dateRange) {
                vm.dateRange = {};
              }
              vm.dateRange.startDate = vm.dateRangeBefore.startDate;
              vm.dateRange.endDate = vm.dateRangeBefore.endDate;
            }
          });
        });
      }
    });
  }
})();
