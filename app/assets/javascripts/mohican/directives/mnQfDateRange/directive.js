//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfDateRange', [function() {
      'use strict';
      return {
        scope: {
          qfChanged: '&',
          model:     '=',
          field:     '=',
          focus:     '=',
        },
        restrict:     'E',
        templateUrl:  'mohican/directives/mnQfDateRange/template.html',
        controller:   'MnQfDateRangeController',
        controllerAs: 'qfDateRange',

        bindToController: true,
      };
    },
  ]);
