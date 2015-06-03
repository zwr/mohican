//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', ['mnGridSelectedItemsService', MnGridController]);

  function MnGridController(mnGridSelectedItemsService) {
    var vm = this;

    vm.selectedItems = mnGridSelectedItemsService.getSelectedItems(vm.mnId);

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

    vm.selectionChanged = function(item) {
      var index = vm.selectedItems.indexOf(item);
      if(index === -1) {
        vm.selectedItems.push(item);
      }
      else {
        vm.selectedItems.splice(index, 1);
      }
      vm.mnOnSelect({
        selectedItems: vm.selectedItems,
      });
    };

    vm.isItemSelected = function(item) {
      var index = vm.selectedItems.indexOf(item);
      if(index === -1) {
        return false;
      }
      else {
        return true;
      }
    };

    vm.orderBy = function(field) {
      if(field.quicksort === true && vm.owner.fullyLoaded) {
        trace_timestamp('Clicked header, starting sorting. ******************************');
        vm.owner.getView(
          field.name,
          //change direction only if orderColumn is clicked second time in row
          ((vm.owner.stateMachine.direction === 'asc' && vm.owner.stateMachine.column === field.name) ? 'desc' : 'asc')
        );
      }
    };

    vm.filterBy = function(fieldName) {
      vm.owner.getView(
        vm.owner.stateMachine.column,
        vm.owner.stateMachine.direction,
        vm.owner.stateMachine.filters,
        fieldName
      );
    };
  }
})();
