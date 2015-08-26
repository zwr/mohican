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
        controller: ['$scope', '$window', 'mnRouter', function($scope, $window, mnRouter) {
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

          vm.editingCurrentItemStateChangeValidator = function(fullStateChanged, nextUrl, currentUrl, params) {
            if(vm.currentMnfDoc) {
              //do not validate if user clicked to preview currentMnfDoc link
              if(nextUrl && currentUrl) {
                var currDocPreviewUrl = currentUrl + '/' + vm.currentMnfDoc._mnid;
                if(currDocPreviewUrl === nextUrl) {
                  return true;
                }
              }
              var confirmed = $window.confirm('You have one item in ' + vm.currentMnfDoc._state + ' state. Rollback all changes?');
              if(confirmed) {
                vm.currentMnfDoc.rollback();
                vm.currentMnfDoc = null;
              }
              return confirmed;
            }
            else {
              return true;
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
        }],
        controllerAs:     'mnFormGrid',
        bindToController: true
      };
    }
  ]);
