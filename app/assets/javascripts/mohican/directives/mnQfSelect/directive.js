//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfSelect', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          qfChanged: '&',
          model: '=',
          field: '=',
          focus: '=',
        },
        templateUrl: 'mohican/directives/mnQfSelect/template.html',
        controller: 'MnQfSelectController',
        controllerAs: 'qfSelect',
        bindToController: true,
      };
    },
  ]);
