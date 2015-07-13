//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfEdit', [function() {
      'use strict';
      return {
        scope:       {},
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-edit/template.html',

        // bindToController: true,

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
        }
      };
    }
  ]);
