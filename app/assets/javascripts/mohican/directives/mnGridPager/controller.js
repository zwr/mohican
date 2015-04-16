//= require_self

(function(mnUtil) {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridPagerController', ['$state', '$stateParams', MnGridPagerController]);

  function MnGridPagerController($state, $stateParams) {
    var vm = this;
    vm.goToPage = function(pageNumber) {
      $stateParams.page = pageNumber.toString();
      vm.getPage({page: pageNumber});
      $state.go($state.current.name, mnUtil.escapeDefaultParameters($stateParams));
    };

    vm.pageCount = 20;
    $stateParams = mnUtil.mnStateParameters($stateParams);
    vm.pageNo = $stateParams.page;
    vm.nextPage = parseInt(vm.pageNo) + 1;
    vm.prevPage = parseInt(vm.pageNo) - 1;

    vm.isFirstPage = function() {
      return parseInt(vm.pageNo) === 1;
    };
    vm.isLastPage = function() {
      return parseInt(vm.pageNo) === vm.pageCount;
    };
    vm.maxToShow = 11;
    vm.paginationArray = function() {
      var number, result, _i;
      var startPage = Math.max(1, vm.pageNo - Math.max(Math.floor(vm.maxToShow / 2), vm.maxToShow - vm.pageCount + parseInt(vm.pageNo) - 1));
      var endPage = Math.min(vm.pageCount, startPage + vm.maxToShow - 1);
      for (number = _i = startPage; startPage <= endPage ? _i <= endPage : _i >= endPage; number = startPage <= endPage ? ++_i : --_i) {
        (result = result || []).push(number);
      }
      return result;
    };

    vm.paginationArray();
    vm.showPageNumber = function(pageNumber, index) {
      if (index === 0 && pageNumber > 1 || index === vm.maxToShow - 1 && pageNumber < vm.pageCount) {
        return '...';
      } else {
        return pageNumber;
      }
    };
  }
})(window.MohicanUtils);
