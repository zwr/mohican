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
      vm.dateFrom = (new Date(today.setDate(today.getDate() + days))).toJSON().slice(0,10);
    };

    vm.getDateFrom = function(days) {
      var today = new Date();
      return new Date(today.setDate(today.getDate() + days)).toJSON().slice(0,10);
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {

      if(newValue[vm.field]) {
        vm.dateFrom = newValue[vm.field];
      }
      else {
        vm.dateFrom = undefined;
      }
    });
  }
})();
