//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfSelect', [function() {
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
        templateUrl:  'mohican/directives/mn-qf-select/template.html',
        controller:   'MnQfSelectController',
        controllerAs: 'qfSelect',

        bindToController: true
      };
    }
  ]);
