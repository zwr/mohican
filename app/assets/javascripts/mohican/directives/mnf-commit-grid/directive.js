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
          scope.commitItem = function() {
            if(scope.mnfDoc._state === 'editing' ||
               scope.mnfDoc._state === 'changed') {
              scope.mnfDoc.commit();
              mnfFormGridCtrl.currentMnfDoc = null;
            }
          };
        }
      };
    }
  ]);
