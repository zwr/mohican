//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          orderChanged: '&',
          fields: '=',
          items: '=',
          quickFilterShown: '=',
        },
        templateUrl: 'mohican/directives/mnGrid/template.html',
        controller: 'MnGridController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
