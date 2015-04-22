angular.module('mnOldDirectives')
  .directive('mnMenuItemRoute', ['mnTranslations', function(mnTranslations) {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          sref: '@?',
        },
        link: {
          pre: function(scope, elem, attr, ctrl, transclude) {
            transclude(function(clone) {
              scope.mnText = mnTranslations.t(clone.text());
              if(scope.sref == null) {
                scope.sref = clone.text().toLowerCase()
              }
              scope.sref_resolved = 'base.' + scope.sref;
            });
          },
          post: function() {
          }
        },
        transclude: true,
        template: '<a ui-sref-active="mn-menu-item-route-active" ui-sref="{{sref_resolved}}"><span>{{mnText}}</span></a>',
      };
    },
  ]);
