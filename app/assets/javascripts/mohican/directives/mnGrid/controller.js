//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', [MnGridController]);

  function MnGridController() {
    var vm = this;

    vm.orderBy = function(field) {
      if(field.quicksort === true && vm.serviceDataLoaded) {
        trace_timestamp('Clicked header, starting sorting. ******************************')
        vm.clientViewChanged({
          column: field.name,
          //change direction only if orderColumn is clicked second time in row
          direction: (vm.orderDirection === 'asc' && vm.orderColumn === field.name) ? 'desc' : 'asc',
        });
      }
    };

    vm.filterBy = function(fieldName) {
      vm.clientViewChanged({
        column: vm.orderColumn,
        direction: vm.orderDirection,
        filters: vm.filters,
        focus: fieldName,
      });
    };
  }
})();
