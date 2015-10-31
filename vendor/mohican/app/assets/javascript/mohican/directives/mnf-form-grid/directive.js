//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfFormGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfCrudShown:       '=?',
          mnfSubdocumetsGrid: '=?'
        },
        restrict:     'E',
        transclude:   true,
        templateUrl:  'mohican/directives/mnf-form-grid/template.html',
        controller:   'MnfFormGridController',
        controllerAs: 'mnFormGrid',

        bindToController: true
      };
    }
  ]);
