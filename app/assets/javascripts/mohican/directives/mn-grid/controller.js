//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridController', ['mnRouter', '$scope', '$window', MnGridController]);

  function MnGridController(mnRouter, $scope, $window) {
    var vm = this;

    vm.stateChangeValidator = function() {
      if(vm.selectedItems.length > 0) {
        var confirmed = $window.confirm('You have ' + vm.selectedItems.length + ' selected item(s). Leaving this page will discard the selection.');
        return confirmed;
      }
      else {
        return true;
      }
    };

    mnRouter.addStateChageValidator(vm.stateChangeValidator);

    $scope.$on('$destroy', function() {
      mnRouter.removeStateChageValidator(vm.stateChangeValidator);
    });

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

    vm.selectionChanged = function(item, $event) {
      var index = vm.selectedItems.indexOf(item);

      if($event && $event.shiftKey && index === -1) {
        if(vm.selectedItems.length > 0) {
          var last = vm.selectedItems[vm.selectedItems.length - 1];
          var lastPosition = vm.owner.items.indexOf(last);
          var itemPosition = vm.owner.items.indexOf(item);
          vm.owner.items.forEach(function(gridItem, i) {
            if(lastPosition > itemPosition &&
               i < lastPosition &&
               i > itemPosition &&
               !vm.isItemSelected(gridItem)) {
              vm.selectedItems.push(gridItem);
            }
            if(lastPosition < itemPosition &&
               i > lastPosition &&
               i < itemPosition &&
               !vm.isItemSelected(gridItem)) {
              vm.selectedItems.push(gridItem);
            }
          });
        }
      }

      if(index === -1) {
        vm.selectedItems.push(item);
      }
      else {
        vm.selectedItems.splice(index, 1);
      }
      vm.mnOnSelect({
        selectedItems: vm.selectedItems
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

    vm.isLastSelected = function(item) {
      return vm.selectedItems.length > 0 &&
             vm.selectedItems[vm.selectedItems.length - 1] === item;
    };

    vm.selectNone = function() {
      vm.selectedItems = [];
    };

    vm.selectAll = function() {
      vm.owner.items.forEach(function(item) {
        if(!vm.isItemSelected(item)) {
          vm.selectedItems.push(item);
        }
      });
    };

    vm.orderBy = function(field) {
      if(field.quicksort === true && vm.owner.fullyLoaded && !vm.onlySelectedItemsShown) {
        trace_timestamp('Clicked header, starting sorting. ******************************');
        vm.owner.clientViewChanged(
          field.name,
          //change direction only if orderColumn is clicked second time in row
          ((vm.owner.stateMachine.direction === 'asc' && vm.owner.stateMachine.column === field.name) ? 'desc' : 'asc')
        );
      }
    };

    vm.filterBy = function() {
      vm.owner.clientViewChanged(
        vm.owner.stateMachine.column,
        vm.owner.stateMachine.direction,
        vm.owner.stateMachine.filters
      );
    };

    vm.rightClick = function(item, $event) {
      if(vm.mnPopup) {
        vm.contextMenuItems = vm.mnPopup({clickedItem: item, selectedItems: vm.selectedItems});
        vm.contextMenuVisible = true;
        vm.menuPosition = {
          left: $event.pageX + 'px',
          top:  $event.pageY + 'px'
        };
      }
    };

    vm.contextMenuAction = function(item) {
      item.action(vm);
      vm.contextMenuVisible = false;
    };
  }
})();
