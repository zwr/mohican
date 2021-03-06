//= require ./template
//= require ./controller
//= require_self

angular.module('mohican')
  .directive('mnfForm', [function() {
      'use strict';
      return {
        scope: {
          mnfDoc:       '=',
          mnfCrudShown: '=?'
        },
        restrict:     'E',
        transclude:   true,
        templateUrl:  'mohican/directives/mnf-form/template.html',
        controller:   'MnfFormController',
        controllerAs: 'mnForm',

        bindToController: true
      };
    }
  ]);
