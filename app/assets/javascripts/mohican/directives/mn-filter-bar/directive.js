//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterBar', [function() {
        return {
          scope: {
            owner: '=?'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-bar/template.html',
          controller:   'MnFilterBarController',
          controllerAs: 'filterBar',
          transclude:   true,

          bindToController: true,

          link: function(scope, element, attrs, ctrl, transclusionFn) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
            transclusionFn(scope, function(clone) {
              console.log(angular.element(clone[1])[0]);
              angular.element(clone[1]).attr('seleted-document-filters', 'filterBar.seletedDocumentFilters');
              angular.element(element.find('.mn-translude')[0]).append(clone);
            });
          }
        };
      }
    ]);
}(window.mohican));
