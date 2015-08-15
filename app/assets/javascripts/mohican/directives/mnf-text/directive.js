//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfText', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfLabel: '@'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-text/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.textChanged = function() {
            scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
            scope.mnfDoc._state = 'changed';
          };
        }
      };
    }
  ]);
