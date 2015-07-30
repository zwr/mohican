//= require_self

angular.module('mohican.directives')
  .directive('mnfFormGrid', [function() {
      'use strict';
      return {
        restrict:   'E',
        transclude: true,
        template:   '<ng-transclude></ng-transclude>',
        controller: function() {
          var vm = this;
          vm.currentMnfDoc = null;
          vm.setCurrenEditingDoc = function(mnDoc) {
            if(vm.currentMnfDoc) {
              vm.currentMnfDoc.rollback();
            }
            vm.currentMnfDoc = mnDoc;
          };
        }
      };
    }
  ]);
