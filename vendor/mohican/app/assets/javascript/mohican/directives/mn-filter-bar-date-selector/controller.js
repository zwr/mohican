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
      today.setHours(0, 0, 0, 0);
      vm.dateFrom = today.setDate(today.getDate() + days);
    };

    vm.getDateFrom = function(days) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return today.setDate(today.getDate() + days);
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {
      vm.dateFrom = newValue[vm.field] ? new Date(newValue[vm.field]) : undefined;
    });
  }
})();
