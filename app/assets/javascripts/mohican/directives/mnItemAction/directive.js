//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnItemAction', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'mohican/directives/mnItemAction/template.html',
        controller: 'mnItemActionController',
        controllerAs: 'itemAction',
        bindToController: true,
      };
    },
  ]);
