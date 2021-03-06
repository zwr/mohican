//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnGridPagerController', ['$scope', MnGridPagerController]);

  function MnGridPagerController() {
    var vm = this;
    vm.isQuickFiltered = function() {
      var filtered = false;
      for(var f in vm.owner.stateMachine.filters) {
        if(!_.isEmpty(vm.owner.stateMachine.filters[f])) {
          filtered = true;
          break;
        }
      }
      return filtered;
    };

    vm.nextPage = function() {
      return vm.owner.stateMachine.page >= vm.owner.pageCount ? vm.owner.pageCount : (parseInt(vm.owner.stateMachine.page) + 1);
    };
    vm.prevPage = function() {
      return vm.owner.stateMachine.page <= 1 ? 1 : (parseInt(vm.owner.stateMachine.page) - 1);
    };

    vm._changePage = function(page) {
      vm.owner.pageChanged(page);
    };

    vm.isFirstPage = function() {
      return parseInt(vm.owner.stateMachine.page) === 1;
    };
    vm.isLastPage = function() {
      return parseInt(vm.owner.stateMachine.page) === vm.owner.pageCount;
    };
    vm._maxToShow = 11;
    vm.paginationArray = function() {
      var pages = [];
      var number, _i;
      var startPage = Math.max(1, vm.owner.stateMachine.page - Math.max(Math.floor(vm._maxToShow / 2), vm._maxToShow - vm.owner.pageCount + parseInt(vm.owner.stateMachine.page) - 1));
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
      if (vm.owner.stateMachine.page > (vm._maxToShow + 1) / 2 && vm.owner.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };

    vm.showLinkLast = function() {
      if (vm.owner.stateMachine.page < vm.owner.pageCount - (vm._maxToShow - 1) / 2 && vm.owner.pageCount > vm._maxToShow) {
        return true;
      } else {
        return false;
      }
    };
  }
})();
