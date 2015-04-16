//= require_self

(function(mnUtil) {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridPagerController', ['$state', '$stateParams', MnGridPagerController]);

  function MnGridPagerController($state, $stateParams) {
    var vm = this;
    vm.goToPage = function(pageNumber) {
      console.log($stateParams);
      $stateParams.page = pageNumber.toString();
      $state.go($state.current.name, mnUtil.escapeDefaultParameters($stateParams));
    };
  }
})(window.MohicanUtils);
