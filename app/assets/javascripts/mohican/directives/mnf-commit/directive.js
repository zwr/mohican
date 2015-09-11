//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfCommit', [function() {
      'use strict';
      return {
        scope: {
          onCommitSuccess: '&',
          onCommitFail:    '&'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-commit/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.mnfFormCtrl = mnfFormCtrl;

          scope.commitDoc = function() {
            scope.mnfDoc.commit().then(function() {
              if(scope.onCommitSuccess) {
                scope.onCommitSuccess();
              }
            }, function() {
              if(scope.onCommitFail) {
                scope.onCommitFail();
              }
            });
          };
        }
      };
    }
  ]);
