//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarDateRangeSelectorController', ['$scope', MnFilterBarDateRangeSelectorController]);

  function MnFilterBarDateRangeSelectorController($scope) {
    var vm = this;

    vm.rangeModel = {
      startDate: vm.dateRange ? vm.dateRange.startDate : null,
      endDate:   vm.dateRange ? vm.dateRange.endDate : null
    };

    vm.setDateRange = function(days) {
      var todayStart = new Date();
      todayStart.setHours(12, 0, 0, 0);

      var todayEnd = new Date();
      todayEnd.setHours(12, 0, 0, 0);

      var dateStart = new Date(todayStart.setDate(todayStart.getDate() + days));
      var dateEnd = new Date(todayEnd.setDate(todayEnd.getDate() + days));

      vm.dateRange = {
        startDate: dateStart.toJSON().slice(0, 10),
        endDate:   dateEnd.toJSON().slice(0, 10)
      };
      vm.rangeModel = {
        startDate: dateStart,
        endDate:   dateEnd
      };
    };

    vm.isDaySelected = function(days) {
      var today = new Date();
      today.setHours(12, 0, 0, 0);

      var targetDay = new Date(today.setDate(today.getDate() + days));

      var startDate = new Date(vm.rangeModel.startDate);
      var endDate = new Date(vm.rangeModel.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 0);

      if(targetDay > startDate &&
         targetDay < endDate) {
        return true;
      }
      else {
        return false;
      }
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {

      if(newValue[vm.field]) {
        vm.rangeModel.startDate = (new Date(newValue[vm.field].startDate)).toJSON().slice(0, 10);
        vm.rangeModel.endDate = (new Date(newValue[vm.field].endDate)).toJSON().slice(0, 10);
      }
      else {
        vm.rangeModel.startDate = null;
        vm.rangeModel.endDate = null;
      }
    });

    $scope.$watch(function() {
      return vm.rangeModel;
    }, function(newValue, oldValue) {
      if(newValue.startDate === null) {

      }
      else {
        if(!vm.owner.stateMachine.openfilters[vm.field]) {
          vm.owner.stateMachine.openfilters[vm.field] = {};
        }
        vm.dateRange = vm.owner.stateMachine.openfilters[vm.field];
        var startDate = new Date(newValue.startDate);
        var endDate = new Date(newValue.endDate);
        startDate.setHours(12, 0, 0, 0);
        endDate.setHours(12, 0, 0, 0);
        vm.dateRange.startDate = (new Date(startDate.setDate(startDate.getDate()))).toJSON().slice(0, 10);
        vm.dateRange.endDate = (new Date(endDate.setDate(endDate.getDate()))).toJSON().slice(0, 10);
      }
    });
  }
})();
