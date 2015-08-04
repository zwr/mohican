//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfDelete', ['$window', function($window) {
      'use strict';
      return {
        scope:       {},
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-delete/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.mnfFormCtrl = mnfFormCtrl;

          scope.confirmDelete = function() {
            if($window.confirm('Are you sure that you want to permanently delete document?')) {
              scope.mnfDoc.delete();
            }
          };
        }
      };
    }
  ]);
