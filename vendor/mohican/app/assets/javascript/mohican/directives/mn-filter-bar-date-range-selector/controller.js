//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarDateRangeSelectorController', ['$scope', MnFilterBarDateRangeSelectorController]);

  function MnFilterBarDateRangeSelectorController($scope) {
    var vm = this;

    vm.setDateRange = function(days) {
      var todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      var todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 0);

      vm.dateRange = {
        startDate: new Date(todayStart.setDate(todayStart.getDate() + days)),
        endDate:   new Date(todayEnd.setDate(todayEnd.getDate() + days))
      };
    };

    vm.isDaySelected = function(days) {
      return false;
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {

      if(newValue[vm.field]) {
        vm.dateFrom = new Date(newValue[vm.field].setHours(12, 0, 0, 0));
      }
      else {
        vm.dateFrom = undefined;
      }
    });
  }
})();
