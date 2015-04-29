//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnFilterBar', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          layoutChanged: '&',
          layouts: '=',
          quickFilterShown: '=',
        },
        templateUrl: 'mohican/directives/mnFilterBar/template.html',
        controller: 'MnFilterBarController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
