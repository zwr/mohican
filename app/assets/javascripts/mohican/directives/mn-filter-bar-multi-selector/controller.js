//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarMultiSelectorController', ['$scope', MnFilterBarMultiSelectorController]);

  function MnFilterBarMultiSelectorController($scope) {
    var vm = this;

    vm.selectValues = [];
    var vals = vm.values.split(',');
    vals.forEach(function(v) {
      vm.selectValues.push({name: _.trim(v)});
    });
    vm.selectValuesLabels = {
      nothingSelected: 'All'
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {
      vm.selectValues.forEach(function(status) {
        status.selected = false;
      });
      if(newValue.status && vm.selectValues) {
        vm.selectValues.forEach(function(status) {
          newValue.status.forEach(function(stateMachineStatus) {
            if(stateMachineStatus === status.name) {
              status.selected = true;
            }
          });
        });
      }
    });
  }
})();
