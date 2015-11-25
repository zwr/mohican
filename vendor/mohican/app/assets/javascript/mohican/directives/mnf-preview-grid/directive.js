//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfPreviewGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          owner:  '=?',
          mnfDoc: '=?'
        },
        templateUrl: 'mohican/directives/mnf-preview-grid/template.html',

        link: function(scope) {
          scope.owner = mohican.scopeLookup(scope);
        }
      };
    }
  ]);
