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
      vm.selectValues.forEach(function(sVal) {
        sVal.selected = false;
      });
      if(newValue[vm.field] && vm.selectValues) {
        vm.selectValues.forEach(function(sVal) {
          newValue[vm.field].forEach(function(stateMachineValue) {
            if(stateMachineValue === sVal.name) {
              sVal.selected = true;
            }
          });
        });
      }
    });
  }
})();
