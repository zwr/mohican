//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnViewField', [function() {
      'use strict';
      return {
        scope: {
          model: '=',
          field: '='
        },
        restrict:     'E',
        templateUrl:  'mohican/directives/mn-view-field/template.html',
        controller:   'mnViewFieldController',
        controllerAs: 'viewField',

        bindToController: true
      };
    }
  ]);
