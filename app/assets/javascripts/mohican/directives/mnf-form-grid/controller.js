//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnfFormGridController', ['$scope', 'mnRouter', MnfFormGridController]);

  function MnfFormGridController($scope, mnRouter) {
    var vm = this;
    vm.currentMnfDoc = null;
    vm.setCurrenEditingDoc = function(mnDoc) {
      if(vm.currentMnfDoc) {
        vm.currentMnfDoc.rollback();
      }
      vm.currentMnfDoc = mnDoc;
    };
    vm.mnfCrudShown = angular.isDefined(vm.mnfCrudShown) ? vm.mnfCrudShown : true;
    vm.mnfSubdocumetsGrid = angular.isDefined(vm.mnfSubdocumetsGrid) ? vm.mnfSubdocumetsGrid : false;

    vm.editingCurrentItemStateChangeValidator = function(fullStateReload, nextUrl, currentUrl, params) {
      if(vm.currentMnfDoc) {
        //do not validate if user clicked to preview currentMnfDoc link
        if(nextUrl && currentUrl) {
          var currDocPreviewUrl = currentUrl + '/' + vm.currentMnfDoc._mnid;
          if(currDocPreviewUrl === nextUrl) {
            return null;
          }
        }

        return {
          message: 'You have one item in ' + vm.currentMnfDoc._state + ' state.',
          resolve: function() {
            vm.currentMnfDoc.rollback();
            vm.currentMnfDoc = null;
            console.log('resolve');
          },
          reject: function() { console.log('reject'); }
        };
      }
      else {
        return null;
      }
    };

    mnRouter.addStateChageValidator(vm.editingCurrentItemStateChangeValidator);

    $scope.$on('$destroy', function() {
      mnRouter.removeStateChageValidator(vm.editingCurrentItemStateChangeValidator);
    });

    var unwatch = $scope.$watch(function() {
      return vm.mnfCrudShown;
    }, function(newValue) {
      if(newValue === false && vm.currentMnfDoc) {
        if(vm.mnfSubdocumetsGrid) {
          // vm.currentMnfDoc.commit();
        }
        else {
          vm.currentMnfDoc.rollback();
        }
      }
    });

    $scope.$on('$destroy', function() {
      unwatch();
    });

    vm.addNewItem = function() {
      console.log('addNewItem');
    };
  }
})();
