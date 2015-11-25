//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterBarDateRangeSelector', [function() {
        return {
          scope: {
            owner:     '=?',
            dateRange: '=?',
            field:     '@',
            label:     '@'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-bar-date-range-selector/template.html',
          controller:   'MnFilterBarDateRangeSelectorController',
          controllerAs: 'filterBarDateRangeSelector',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
        };
      }
    ]);
}(window.mohican));
