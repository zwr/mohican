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
  }
})();
