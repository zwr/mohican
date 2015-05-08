//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfDateRangeController', ['$element', MnQfDateRangeController]);

  function MnQfDateRangeController($element) {
    var vm = this;

    if(vm.focus) {
      $element.find('input')[0].focus();
    }

    vm.inputChanged = function() {
      console.log('DATE RANGE CHANGED');
      // vm.qfChanged({fieldName: vm.field.name});
    };

    vm.date = {startDate: null, endDate: null};
  }
})();
