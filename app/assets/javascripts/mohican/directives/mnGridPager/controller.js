//= require_self

(function(MohicanUtils) {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridPagerController', ['$scope', MnGridPagerController]);

  function MnGridPagerController($scope) {
    var vm = this;
    vm.owner = MohicanUtils.scopeLookup($scope);

    vm.nextPage = function() {
      return vm.owner.page >= vm.owner.pageCount ? vm.owner.pageCount : (parseInt(vm.owner.page) + 1);
    };
    vm.prevPage = function() {
      return vm.owner.page <= 1 ? 1 : (parseInt(vm.owner.page) - 1);
    };

    vm._changePage = function(page) {
      vm.owner.getPage(page);
    };

    vm.isFirstPage = function() {
      return parseInt(vm.owner.page) === 1;
    };
    vm.isLastPage = function() {
      return parseInt(vm.owner.page) === vm.owner.pageCount;
    };
    vm._maxToShow = 11;
    vm.paginationArray = function() {
      var pages = [];
      var number, _i;
      var startPage = Math.max(1, vm.owner.page - Math.max(Math.floor(vm._maxToShow / 2), vm._maxToShow - vm.owner.pageCount + parseInt(vm.owner.page) - 1));
      var endPage = Math.min(vm.owner.pageCount, startPage + vm._maxToShow - 1);
      for (number = _i = startPage; startPage <= endPage ? _i <= endPage : _i >= endPage; number = startPage <= endPage ? ++_i : --_i) {
        pages.push(number);
      }
      return pages;
    };

    vm.paginationArray();
    vm.showPageNumber = function(pageNumber, index) {
      if (index === 0 && pageNumber > 1 || index === vm._maxToShow - 1 && pageNumber < vm.owner.pageCount) {
        return '...';
      } else {
        return pageNumber;
      }
    };

    vm.showLinkFirst = function() {
      if (vm.owner.page > (vm._maxToShow + 1) / 2 && vm.owner.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };

    vm.showLinkLast = function() {
      if (vm.owner.page < vm.owner.pageCount - (vm._maxToShow - 1) / 2 && vm.owner.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };
  }
})(window.MohicanUtils);
