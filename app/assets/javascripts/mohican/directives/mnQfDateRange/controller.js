//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfDateRangeController', ['$scope', '$timeout', MnQfDateRangeController]);

  function MnQfDateRangeController($scope, $timeout) {
    var vm = this;

    if(vm.model) {
      vm.dateRange = {
        startDate: vm.model.startDate,
        endDate: vm.model.endDate,
      };
    }
    else {
      vm.dateRange = {
        startDate: null,
        endDate: null,
      };
    }

    $scope.$watch(function() { return vm.dateRange; }, function (newValue, oldValue) {
      if(newValue !== oldValue) {
        if(newValue.startDate === null || newValue.endDate === null) {
          vm.model = undefined;
        }
        else {
          vm.model = {
            startDate: newValue.startDate,
            endDate: newValue.endDate,
          };
        }
        $timeout(function() {
          vm.qfChanged({fieldName: vm.field.name});
        });
      }
    });
  }
})();
