//= require_self

angular.module('mohican')
  .directive('mnfFormGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfCrudShown:       '=?',
          mnfSubdocumetsGrid: '=?'
        },
        restrict:   'E',
        transclude: true,
        template:   '<ng-transclude></ng-transclude>',
        controller: ['$scope', function($scope) {
          var vm = this;
          vm.mnfCrudShown = angular.isDefined(vm.mnfCrudShown) ? vm.mnfCrudShown : true;
          vm.mnfSubdocumetsGrid = angular.isDefined(vm.mnfSubdocumetsGrid) ? vm.mnfSubdocumetsGrid : false;

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

          vm.currentMnfDoc = null;
          vm.setCurrenEditingDoc = function(mnDoc) {
            if(vm.currentMnfDoc) {
              vm.currentMnfDoc.rollback();
            }
            vm.currentMnfDoc = mnDoc;
          };
        }],
        controllerAs:     'mnFormGrid',
        bindToController: true
      };
    }
  ]);
