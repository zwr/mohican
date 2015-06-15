//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfSelectController', ['$scope', '$timeout', MnQfSelectController]);

  function MnQfSelectController($scope, $timeout) {
    var vm = this;

    vm.selectItems = [];

    vm.field.values.forEach(function(value) {
      vm.selectItems.push({
        name:     value,
        selected: _.contains(vm.model, value)
      });
    });

    vm.labels = {
      nothingSelected: 'All'
    };

    vm.inputChanged = function() {
      vm.model = vm.selectedValues.map(function(elem) {
        return elem.name;
      });
      var rememberCurrentSelectedList = vm.model;
      $timeout(function() {
        if(rememberCurrentSelectedList === vm.model) {
          vm.qfChanged({fieldName: vm.field.name});
        }
      });
    };

    $scope.$watch(function() { return vm.model; }, function (newValue) {
      if(angular.isUndefined(newValue)) {
        vm.selectItems = [];

        vm.field.values.forEach(function(value) {
          vm.selectItems.push({
            name:     value,
            selected: _.contains(vm.model, value)
          });
        });
      }
    });
  }
})();
