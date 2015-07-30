//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfTextGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfDoc:   '=?'
        },
        restrict:    'E',
        templateUrl: 'mohican/directives/mnf-text-grid/template.html',

        link: function(scope) {
          if(!scope.mnfDoc._state) {
            scope.mnfDoc._state = 'ready';
          }
          scope.textChanged = function() {
            scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
            scope.mnfDoc._state = 'changed';
          };
        }
      };
    }
  ]);
