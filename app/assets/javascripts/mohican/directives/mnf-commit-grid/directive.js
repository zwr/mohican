//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfCommitGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc: '=?'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-commit-grid/template.html',

        link: function(scope, elem, attr, mnfFormGridCtrl) {
          scope.$watch(function() { return mnfFormGridCtrl.currentMnfDoc; },
                        function(newValue) {
                          scope.currentMnfDoc = newValue;
                        });
          scope.commitItem = function() {
            scope.mnfDoc.commit();
            mnfFormGridCtrl.currentMnfDoc = null;
          };
        }
      };
    }
  ]);
