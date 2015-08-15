//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfTextGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfDoc:   '=?',
          readOnly: '=?'
        },
        restrict:    'E',
        templateUrl: 'mohican/directives/mnf-text-grid/template.html',

        link: function(scope) {
          scope.textChanged = function() {
            scope.mnfDoc.change(scope.mnfField);
          };
        }
      };
    }
  ]);
