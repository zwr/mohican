//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfDelete', ['$window', 'mnRouter', function($window, mnRouter) {
      'use strict';
      return {
        scope: {
          onDeleteSuccess: '&',
          onDeleteFail:    '&'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-delete/template.html',
        controller:  ['mnPing', '$scope', function(mnPing, $scope) {
          $scope.mnPing = mnPing;
        }],

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.mnfFormCtrl = mnfFormCtrl;

          scope.confirmDelete = function() {
            if($window.confirm('Are you sure that you want to permanently delete document?')) {
              scope.mnfDoc.delete().then(function() {
                if(scope.onDeleteSuccess) {
                  scope.onDeleteSuccess();
                }
              }, function() {
                if(scope.onDeleteFail) {
                  scope.onDeleteFail();
                }
              });
            }
          };
        }
      };
    }
  ]);
