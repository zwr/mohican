//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarMultiSelectorController', ['$scope', MnFilterBarMultiSelectorController]);

  function MnFilterBarMultiSelectorController($scope) {
    var vm = this;

    vm.statuses = [];
    var vals = vm.values.split(',');
    vals.forEach(function(v) {
      vm.statuses.push({name: _.trim(v)});
    });
    vm.statusesLabels = {
      nothingSelected: 'All'
    };

    $scope.$watch(function() {
      return vm.owner.stateMachine.openfilters;
    }, function(newValue, oldValue) {
      vm.statuses.forEach(function(status) {
        status.selected = false;
      });
      if(newValue.status && vm.statuses) {
        vm.statuses.forEach(function(status) {
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
