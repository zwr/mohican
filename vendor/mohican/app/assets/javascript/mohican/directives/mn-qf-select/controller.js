//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
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

    vm.modelBefore = _.cloneDeep(vm.model);

    vm.inputChanged = function() {
      vm.model = vm.selectedValues.map(function(elem) {
        return elem.name;
      });
      $timeout(function() {
        vm.qfChanged({fieldName: vm.field.name}).
           then(function() {
             vm.modelBefore = _.cloneDeep(vm.model);
           }, function() {
             vm.selectItems.forEach(function(sItem) {
               sItem.selected = false;
               if(vm.modelBefore) {
                 for(var i = 0; i < vm.modelBefore.length; i++) {
                   if(vm.modelBefore[i] === sItem.name) {
                     sItem.selected = true;
                     break;
                   }
                 }
               }
             });
           });
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
