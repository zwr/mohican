//= require_self

angular.module('mohican.directives')
  .directive('mnfFormGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfCrudShown: '=?'
        },
        restrict:   'E',
        transclude: true,
        template:   '<ng-transclude></ng-transclude>',
        controller: ['$scope', function($scope) {
          var vm = this;
          vm.mnfCrudShown = angular.isDefined(vm.mnfCrudShown) ? vm.mnfCrudShown : true;

          var unwatch = $scope.$watch(function() {
            return vm.mnfCrudShown;
          }, function(newValue) {
            if(newValue === false && vm.currentMnfDoc) {
              vm.currentMnfDoc.rollback();
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
