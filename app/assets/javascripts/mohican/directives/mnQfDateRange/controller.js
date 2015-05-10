//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnQfDateRangeController', ['$timeout', MnQfDateRangeController]);

  function MnQfDateRangeController($timeout) {
    var vm = this;

    if(vm.model) {
      //unpack date picker to string url params
      var urlFilters = vm.model.split('---');
      var startDate = new Date(urlFilters[0].split('_').join(' '));
      var endDate = new Date(urlFilters[1].split('_').join(' '));
      vm.date = {
        startDate: startDate,
        endDate: endDate,
      };
    }
    else {
      vm.date = {startDate: null, endDate: null};
    }

    vm.inputChanged = function() {
      //pack date picker to string url params
      vm.model = vm.date.startDate.toString().split(' ').join('_') +
                 '---' +
                 vm.date.endDate.toString().split(' ').join('_');
      var rememberCurrentText = vm.model;
      $timeout(function() {
        if(rememberCurrentText === vm.model) {
          vm.qfChanged({fieldName: vm.field.name});
        }
      });
    };
  }
})();
