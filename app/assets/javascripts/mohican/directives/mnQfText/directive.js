//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfText', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          qfChanged: '&',
          model: '=',
          field: '=',
          focus: '=',
        },
        templateUrl: 'mohican/directives/mnQfText/template.html',
        controller: 'MnQfTextController',
        controllerAs: 'qfText',
        bindToController: true,
      };
    },
  ]);
