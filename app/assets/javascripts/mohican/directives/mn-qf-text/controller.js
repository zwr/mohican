//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnQfTextController', ['$scope', '$element', '$timeout', MnQfTextController]);

  function MnQfTextController($scope, $element, $timeout) {
    var vm = this;

    vm.inputChanged = function() {
      if(vm.model === '') {
        vm.model = undefined;
      }
      var rememberCurrentText = vm.model;
      $timeout(function() {
        if(rememberCurrentText === vm.model) {
          vm.qfChanged({fieldName: vm.field.name});
        }
      }, 200);
    };
  }
})();
