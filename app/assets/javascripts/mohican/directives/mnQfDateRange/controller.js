//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfDateRangeController', ['$timeout', MnQfDateRangeController]);

  function MnQfDateRangeController($timeout) {
    var vm = this;

    if(!vm.model) {
      vm.model = {startDate: null, endDate: null};
    }

    vm.inputChanged = function() {
      $timeout(function() {
        vm.qfChanged({fieldName: vm.field.name});
      });
    };
  }
})();
