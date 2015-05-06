//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          clientViewChanged: '&',
          fields: '=',
          items: '=',
          quickFilterShown: '=',
          quickFilterFocus: '=',
          serviceDataLoaded: '=',
          orderColumn: '=',
          orderDirection: '=',
          filters: '=',
        },
        templateUrl: 'mohican/directives/mnGrid/template.html',
        controller: 'MnGridController',
        controllerAs: 'grid',
        bindToController: true,
      };
    },
  ]);
