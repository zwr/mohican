//= require ./template
//= require ./controller
//= require_self

angular.module('mohican')
  .directive('mnQfDateRange', [function() {
      'use strict';
      return {
        scope: {
          qfChanged:  '&',
          qfDisabled: '=',
          model:      '=',
          field:      '=',
          focus:      '='
        },
        restrict:     'E',
        templateUrl:  'mohican/directives/mn-qf-date-range/template.html',
        controller:   'MnQfDateRangeController',
        controllerAs: 'qfDateRange',

        bindToController: true
      };
    }
  ]);
