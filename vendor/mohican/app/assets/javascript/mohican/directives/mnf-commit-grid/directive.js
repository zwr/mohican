//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfCommitGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc:          '=?',
          onCommitSuccess: '&',
          onCommitFail:    '&'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-commit-grid/template.html',
        controller:  ['mnPing', '$scope', function(mnPing, $scope) {
          $scope.mnPing = mnPing;
        }],

        link: function(scope, elem, attr, mnfFormGridCtrl) {
          scope.mnfFormGridCtrl = mnfFormGridCtrl;
          scope.commitItem = function() {
            if(scope.mnfDoc._state === 'changed') {
              scope.mnfDoc.commit().then(function() {
                if(scope.onCommitSuccess) {
                  scope.onCommitSuccess();
                }
              }, function() {
                if(scope.onCommitFail) {
                  scope.onCommitFail();
                }
              });
              mnfFormGridCtrl.currentMnfDoc = null;
            }
          };
        }
      };
    }
  ]);
