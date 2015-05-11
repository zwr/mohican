//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnViewField', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          model: '=',
          field: '=',
        },
        templateUrl: 'mohican/directives/mnViewField/template.html',
        controller: 'mnViewFieldController',
        controllerAs: 'viewField',
        bindToController: true,
      };
    },
  ]);
