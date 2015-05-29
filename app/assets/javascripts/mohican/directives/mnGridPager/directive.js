//= require ./template
//= require ./controller
//= require_self

(function(MohicanUtils) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnGridPager', [function() {
        return {
          restrict: 'E',
          scope: {
            owner: '=?',
          },
          templateUrl: 'mohican/directives/mnGridPager/template.html',
          controller: 'MnGridPagerController',
          controllerAs: 'gridPager',
          bindToController: true,
          link: function(scope, element, attrs, ctrl) {
            ctrl.owner = scope.owner = MohicanUtils.scopeLookup(scope);
          },
        };
      },
    ]);
  }(window.MohicanUtils));
