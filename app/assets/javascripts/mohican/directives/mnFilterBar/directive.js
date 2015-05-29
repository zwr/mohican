//= require ./template
//= require ./controller
//= require_self
(function(MohicanUtils) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnFilterBar', [function() {
        return {
          restrict: 'E',
          scope: {
            owner: '=?',
          },
          templateUrl: 'mohican/directives/mnFilterBar/template.html',
          controller: 'MnFilterBarController',
          controllerAs: 'filterBar',
          bindToController: true,
          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = MohicanUtils.scopeLookup(scope);
          },
        };
      },
    ]);
}(window.MohicanUtils));
