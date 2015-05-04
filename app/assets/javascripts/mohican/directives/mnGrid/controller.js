//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', [MnGridController]);

  function MnGridController() {
    var vm = this;

    vm.orderBy = function(column) {
      if(vm.serviceDataLoaded) {
        vm.clientViewChanged({
          column: column,
          //change direction only if orderColumn is clicked second time in row
          direction: (vm.orderDirection === 'asc' && vm.orderColumn === column) ? 'desc' : 'asc',
        });
      }
    };

    vm.filterBy = function() {
      vm.clientViewChanged({
        column: vm.orderColumn,
        direction: vm.orderDirection,
        filters: vm.filters,
      });
    };
  }
})();
