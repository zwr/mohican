//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfSelect', [function() {
      'use strict';
      return {
        scope: {
          qfChanged: '&',
          model:     '=',
          field:     '=',
          focus:     '=',
        },
        restrict:     'E',
        templateUrl:  'mohican/directives/mnQfSelect/template.html',
        controller:   'MnQfSelectController',
        controllerAs: 'qfSelect',

        bindToController: true,
      };
    },
  ]);
