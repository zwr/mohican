//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnfForm', [function() {
      'use strict';
      return {
        scope: {
          mnfDoc: '=?'
        },
        restrict:     'E',
        transclude:   true,
        templateUrl:  'mohican/directives/mnf-form/template.html',
        controller:   'MnfFormController',
        controllerAs: 'mnForm',

        bindToController: true

        // link: function(scope, element, attrs, ctrl) {
        //
        // }
      };
    }
  ]);
