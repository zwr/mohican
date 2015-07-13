//= require ./template
//= require_self

angular.module('mohican.directives')
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

        // bindToController: true,

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
        }
      };
    }
  ]);
