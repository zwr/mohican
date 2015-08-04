//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnTab', [function() {
      'use strict';
      return {
        scope: {
          heading:          '@',
          mnContentChanged: '='
        },
        restrict:    'E',
        transclude:  true,
        require:     '^mnTabs',
        templateUrl: 'mohican/directives/mn-tab/template.html',

        link: function(scope, elem, attr, mnTabsCtrl) {
          scope.active = false;
          mnTabsCtrl.addTab(scope);
        }
      };
    }
  ]);
