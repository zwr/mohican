//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfSelectController', ['$scope', '$timeout', MnQfSelectController]);

  function MnQfSelectController($scope, $timeout) {
    var vm = this;

    vm.selectValues = [];

    vm.field.values.forEach(function(value) {
      vm.selectValues.push({
        name: value,
        show: value,
        selected: value === vm.model,
      });
    });

    vm.inputChanged = function(name) {
      console.log(name);
      vm.model = name;
      var rememberCurrentText = vm.model;
      $timeout(function() {
        if(rememberCurrentText === vm.model) {
          vm.qfChanged({fieldName: vm.field.name});
        }
      });
    };
  }
})();
