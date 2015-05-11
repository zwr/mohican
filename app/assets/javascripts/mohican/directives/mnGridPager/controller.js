//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridPagerController', [MnGridPagerController]);

  function MnGridPagerController() {
    var vm = this;

    vm.nextPage = vm.currentPage >= vm.pageCount ? vm.pageCount : (parseInt(vm.currentPage) + 1);
    vm.prevPage = vm.currentPage <= 1 ? 1 : (parseInt(vm.currentPage) - 1);

    vm._changePage = function(page) {
      vm.pageChanged({page: page});
    };

    vm.isFirstPage = function() {
      return parseInt(vm.currentPage) === 1;
    };
    vm.isLastPage = function() {
      return parseInt(vm.currentPage) === vm.pageCount;
    };
    vm._maxToShow = 11;
    vm.paginationArray = function() {
      var pages = [];
      var number, _i;
      var startPage = Math.max(1, vm.currentPage - Math.max(Math.floor(vm._maxToShow / 2), vm._maxToShow - vm.pageCount + parseInt(vm.currentPage) - 1));
      var endPage = Math.min(vm.pageCount, startPage + vm._maxToShow - 1);
      for (number = _i = startPage; startPage <= endPage ? _i <= endPage : _i >= endPage; number = startPage <= endPage ? ++_i : --_i) {
        pages.push(number);
      }
      return pages;
    };

    vm.paginationArray();
    vm.showPageNumber = function(pageNumber, index) {
      if (index === 0 && pageNumber > 1 || index === vm._maxToShow - 1 && pageNumber < vm.pageCount) {
        return '...';
      } else {
        return pageNumber;
      }
    };

    vm.showLinkFirst = function() {
      if (vm.currentPage > (vm._maxToShow + 1) / 2 && vm.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };

    vm.showLinkLast = function() {
      if (vm.currentPage < vm.pageCount - (vm._maxToShow - 1) / 2 && vm.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };
  }
})();
