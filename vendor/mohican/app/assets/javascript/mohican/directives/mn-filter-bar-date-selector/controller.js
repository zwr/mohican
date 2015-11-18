//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarDateSelectorController', ['$scope', MnFilterBarDateSelectorController]);

  function MnFilterBarDateSelectorController($scope) {
    var vm = this;

    vm.setDateFrom = function(days) {
      var today = new Date();
      today.setHours(12, 0, 0, 0);
      vm.dateFrom = new Date(today.setDate(today.getDate() + days));
    };

    vm.getDateFrom = function(days) {
      var today = new Date();
      today.setHours(12, 0, 0, 0);
      return new Date(today.setDate(today.getDate() + days));
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
