//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', [MnGridController]);

  function MnGridController() {
    var vm = this;

    vm.orderBy = function(field) {
      if(field.quicksort === true && vm.owner.fullyLoaded) {
        trace_timestamp('Clicked header, starting sorting. ******************************');
        vm.owner.getView(
          field.name,
          //change direction only if orderColumn is clicked second time in row
          ((vm.owner.direction === 'asc' && vm.owner.column === field.name) ? 'desc' : 'asc')
        );
      }
    };

    vm.filterBy = function(fieldName) {
      vm.owner.getView(
        vm.owner.column,
        vm.owner.direction,
        vm.owner.filters,
        fieldName
      );
    };
  }
})();
