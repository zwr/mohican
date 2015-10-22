//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarDateSelectorController', ['$scope', MnFilterBarDateSelectorController]);

  function MnFilterBarDateSelectorController($scope) {
    var vm = this;

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {
      vm.dateFrom = newValue.delivery_date ? new Date(newValue.delivery_date) : undefined;
    });
  }
})();
