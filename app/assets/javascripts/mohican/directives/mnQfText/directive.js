//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnQfText', [function() {
      'use strict';
      return {
        scope: {
          qfChanged: '&',
          model:     '=',
          field:     '='
        },
        restrict:     'E',
        templateUrl:  'mohican/directives/mnQfText/template.html',
        controller:   'MnQfTextController',
        controllerAs: 'qfText',

        bindToController: true
      };
    }
  ]);
