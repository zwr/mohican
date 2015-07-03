//= require ./template
//= require ./controller
//= require_self

(function(mohican) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnGridPager', [function() {
        return {
          scope: {
            owner: '=?'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-grid-pager/template.html',
          controller:   'MnGridPagerController',
          controllerAs: 'gridPager',

          bindToController: true,

          link: function(scope, element, attrs, ctrl) {
            if(!ctrl.owner) {
              ctrl.owner = scope.owner = mohican.scopeLookup(scope);
            }
          }
        };
      }
    ]);
  }(window.mohican));
