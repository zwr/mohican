//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfDateRange', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          qfChanged: '&',
          model: '=',
          field: '=',
          focus: '=',
        },
        templateUrl: 'mohican/directives/mnQfDateRange/template.html',
        controller: 'MnQfDateRangeController',
        controllerAs: 'qfDateRange',
        bindToController: true,
      };
    },
  ]);
