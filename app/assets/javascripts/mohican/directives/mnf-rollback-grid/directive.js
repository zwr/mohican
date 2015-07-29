//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfRollbackGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc: '=?'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-rollback-grid/template.html',

        link: function(scope, elem, attr, mnfFormGridCtrl) {
          scope.$watch(function() { return mnfFormGridCtrl.currentMnfDoc; },
                        function(newValue) {
                          scope.currentMnfDoc = newValue;
                        });

          scope.rollbackItem = function() {
            scope.mnfDoc.rollback();
            mnfFormGridCtrl.currentMnfDoc = null;
          };
        }
      };
    }
  ]);
