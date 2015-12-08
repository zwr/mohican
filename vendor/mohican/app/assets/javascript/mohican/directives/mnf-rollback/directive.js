//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfRollback', [function() {
      'use strict';
      return {
        scope: {
          onRollbackSuccess: '&?'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-rollback/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.mnfFormCtrl = mnfFormCtrl;
          if(!scope.mnfDoc._mnid && !scope.onRollbackSuccess) {
            scope.actionShown = false;
          }
          else {
            scope.actionShown = true;
          }
          scope.rollbackPressed = function() {
            if(!scope.mnfDoc._mnid) {
              if(scope.onRollbackSuccess) {
                scope.onRollbackSuccess({mnfDoc: scope.mnfDoc});
              }
            }
            else {
              scope.mnfDoc.rollback();
              if(scope.onRollbackSuccess) {
                scope.onRollbackSuccess({mnfDoc: scope.mnfDoc});
              }
            }
          };
        }
      };
    }
  ]);
