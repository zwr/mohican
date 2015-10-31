//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfPreviewGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc: '=?',
          route:  '@'
        },
        templateUrl: 'mohican/directives/mnf-preview-grid/template.html'
      };
    }
  ]);
