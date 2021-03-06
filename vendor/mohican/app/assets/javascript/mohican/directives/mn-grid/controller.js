//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnGridController', ['mnRouter', '$scope', '$window', '$q', '$location', MnGridController]);

  function MnGridController(mnRouter, $scope, $window, $q, $location) {
    var vm = this;

    vm.selectedItemsStateChangeValidator = function(fullStateReload) {
      //do not validate if only "after '?' params" are changed (fullStateReload === true)
      if(fullStateReload && vm.selectedItems.length > 0) {
        return {
          message: 'You have ' + vm.selectedItems.length + ' selected document(s).',
          resolve: function() { console.log('resolve'); },
          reject:  function() { console.log('reject'); }
        };
      }
      else {
        return null;
      }
    };

    mnRouter.addStateChageValidator(vm.selectedItemsStateChangeValidator);

    $scope.$on('$destroy', function() {
      mnRouter.removeStateChageValidator(vm.selectedItemsStateChangeValidator);
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

    if(angular.isUndefined(vm.mnFastPreview)) { vm.mnFastPreview = 'none'; }
    else {
      if(vm.mnFastPreview !== 'none' &&
         vm.mnFastPreview !== 'row') {
        throw 'Invalid mn-grid(mn-fast-preview) parameter';
      }
    }

    vm.selectionChanged = function(item, $event) {
      $event.stopPropagation();
      var index = vm.selectedItems.indexOf(item);

      if($event && $event.shiftKey && index === -1) {
        if(vm.selectedItems.length > 0) {
          var last = vm.selectedItems[vm.selectedItems.length - 1];
          var lastPosition = vm.owner.items.indexOf(last);
          var itemPosition = vm.owner.items.indexOf(item);
          if(lastPosition !== -1) {
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

    vm.isItemVisible = function(item) {
      return item._state !== 'deleted' ? true : false;
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
      var deffered = $q.defer();
      vm.owner.clientViewChanged(vm.owner.stateMachine.column,
                                 vm.owner.stateMachine.direction,
                                 vm.owner.stateMachine.filters
                               ).
               then(function() {
                 deffered.resolve();
               }, function() {
                 deffered.reject();
               });
      return deffered.promise;
    };

    vm.rightClick = function(item, $event) {
      //return value is checked in mn-right-click directive
      //to prevent or not default events propagation
      if(vm.hasContextMenu) {
        vm.contextMenuItems = vm.mnPopup({clickedItem: item, selectedItems: vm.selectedItems});
        vm.contextMenuVisible = true;
        vm.menuPosition = {
          left: $event.pageX + 'px',
          top:  $event.pageY + 'px'
        };
        return true;
      }
      else {
        return false;
      }
    };

    vm.contextMenuAction = function(item) {
      item.action(vm);
      vm.contextMenuVisible = false;
    };

    vm.fastPreview = function(item) {
      if(vm.mnFastPreview === 'row' && item._state === 'ready') {
        if(vm.owner.resourceName) {
          // $location.path(vm.owner.resourceName + '/' + item._mnid);
          // $location.search({});
          mnRouter.transitionTo(vm.owner.resourceName + '-doc', {
            itemPrimaryKeyId: item._mnid
          });
        }
      }
    };
  }
})();
