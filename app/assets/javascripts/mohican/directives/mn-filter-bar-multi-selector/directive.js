//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterBarMultiSelector', [function() {
        return {
          scope: {
            owner: '=?',

            selectedStatuses: '=?'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-bar-multi-selector/template.html',
          controller:   'MnFilterBarMultiSelectorController',
          controllerAs: 'filterBarMultiSelector',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
        };
      }
    ]);
}(window.mohican));
