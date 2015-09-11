//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfText', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfLabel: '@',
          readOnly: '=?'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-text/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.textChanged = function() {
            scope.mnfDoc.change(scope.mnfField);
          };
        }
      };
    }
  ]);
