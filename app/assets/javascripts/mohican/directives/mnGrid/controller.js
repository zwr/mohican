//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', [MnGridController]);

  function MnGridController() {
    var vm = this;

    vm.selectedItems = [];

    if(angular.isUndefined(vm.mnSelect)) { vm.mnSelect = 'none'; }
    else {
      if(vm.mnSelect !== 'none' &&
         vm.mnSelect !== 'single' &&
         vm.mnSelect !== 'multiple') {
        throw 'Invalid mn-grid(mn-select) parameter';
      }
    }
    if(angular.isUndefined(vm.mnSelectType)) { vm.mnSelectType = 'check'; }
    else {
      if(vm.mnSelectType !== 'check' &&
         vm.mnSelectType !== 'hide-check' &&
         vm.mnSelectType !== 'full') {
        throw 'Invalid mn-grid(mn-select-type) parameter';
      }
    }

    if(vm.mnSelect !== 'none' && vm.mnSelectType !== 'hide-check') {
      vm.showSelectColumn = true;
    }
    else {
      vm.showSelectColumn = false;
    }

    vm.selectionChanged = function() {
      vm.mnOnSelect({
        selectedItems: vm.owner.items.filter(function(item) {
          return item.selected === true;
        }),
      });
    };

    vm.orderBy = function(field) {
      if(field.quicksort === true && vm.owner.fullyLoaded) {
        trace_timestamp('Clicked header, starting sorting. ******************************');
        vm.owner.getView(
          field.name,
          //change direction only if orderColumn is clicked second time in row
          ((vm.owner.direction === 'asc' && vm.owner.column === field.name) ? 'desc' : 'asc')
        );
      }
    };

    vm.filterBy = function(fieldName) {
      vm.owner.getView(
        vm.owner.column,
        vm.owner.direction,
        vm.owner.filters,
        fieldName
      );
    };
  }
})();
