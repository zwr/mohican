//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfDate', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfLabel: '@'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-date/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.moment = moment;
          scope.mnfDoc = mnfFormCtrl.mnfDoc;

          scope.textChanged = function() {
            scope.mnfDoc.change(scope.mnfField);
          };
        }
      };
    }
  ]);
