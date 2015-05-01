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
        vm.orderChanged({column: column, direction: (vm.orderDirection === 'asc' && vm.orderColumn === column) ? 'desc' : 'asc'});
      }
    };

    vm.filterBy = function(column) {
      var filters = {column: column, value: vm[column]};
      vm.filterChanged({column: null, direction: null, filters: filters});
    };
  }
})();
