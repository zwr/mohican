//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnTabs', [function() {
      'use strict';
      return {
        scope:        {},
        restrict:     'E',
        transclude:   true,
        templateUrl:  'mohican/directives/mnTabs/template.html',
        controller:   'MnTabsController',
        controllerAs: 'mnTabs',

        bindToController: true
      };
    }
  ]);
