//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfDateGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfDoc:   '=?',
          readOnly: '=?'
        },
        restrict:    'E',
        templateUrl: 'mohican/directives/mnf-date-grid/template.html',

        link: function(scope) {
          scope.moment = moment;
          scope.textChanged = function() {
            scope.mnfDoc.change(scope.mnfField);
          };
        }
      };
    }
  ]);
