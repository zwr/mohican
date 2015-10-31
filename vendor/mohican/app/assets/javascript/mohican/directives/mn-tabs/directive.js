//= require ./template
//= require ./controller
//= require_self

angular.module('mohican')
  .directive('mnTabs', [function() {
      'use strict';
      return {
        scope: {
          owner: '=?'
        },
        restrict:     'E',
        transclude:   true,
        templateUrl:  'mohican/directives/mn-tabs/template.html',
        controller:   'MnTabsController',
        controllerAs: 'mnTabs',

        bindToController: true,

        link: function(scope, element, attrs, ctrl) {
          if(!ctrl.owner) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
          }
          ctrl.setSelectedTab(ctrl.owner.stateMachine.activetab);
        }
      };
    }
  ]);
