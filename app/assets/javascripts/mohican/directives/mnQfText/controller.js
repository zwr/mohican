//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfTextController', ['$scope', '$element', '$timeout', MnQfTextController]);

  function MnQfTextController($scope, $element, $timeout) {
    var vm = this;

    if(vm.focus) {
      $element.find('input')[0].focus();
    }

    vm.inputChanged = function() {
      var rememberCurrentText = vm.model;
      $timeout(function() {
        if(rememberCurrentText === vm.model) {
          vm.qfChanged({fieldName: vm.field.name});
        }
      }, 200);
    };
  }
})();
