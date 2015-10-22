//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterSelector', [function() {
        return {
          scope: {
            owner: '=?',

            seletedDocumentFilters: '='
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-selector/template.html',
          controller:   'MnFilterSelectorController',
          controllerAs: 'filterSelector',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
        };
      }
    ]);
}(window.mohican));
