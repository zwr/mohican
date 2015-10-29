//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterBarDateSelector', [function() {
        return {
          scope: {
            owner:    '=?',
            dateFrom: '=?',
            field:    '@'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-bar-date-selector/template.html',
          controller:   'MnFilterBarDateSelectorController',
          controllerAs: 'filterBarDateSelector',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
        };
      }
    ]);
}(window.mohican));
