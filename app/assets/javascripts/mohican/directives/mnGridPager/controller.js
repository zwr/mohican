//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridPagerController', ['$state', '$stateParams', MnGridPagerController]);

  function MnGridPagerController($state, $stateParams) {
    var vm = this;
    vm.goToPage = function(pageNumber) {
      console.log($state);
      console.log($stateParams);
      console.log($stateParams.page);
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + pageNumber);
      $state.go($state.current.name, { page: pageNumber });
    };
  }
})();
