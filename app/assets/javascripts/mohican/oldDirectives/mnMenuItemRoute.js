angular.module('mnOldDirectives')
  .directive('mnMenuItemRoute', ['mnTranslations', function(mnTranslations) {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          sref: '@?',
        },
        link: function(scope, elem, attr, ctrl, transclude) {
          transclude(function(clone) {
            scope.mnText = mnTranslations.t(clone.text());
          });
        },
        transclude: true,
        template: '<a ui-sref-active="mn-menu-item-route-active" ui-sref="{{sref}}"><span>{{mnText}}</span></a>',
        controller: ['$scope', function($scope) {
            $scope.sref = $scope.sref || 'base.start';
          },
        ],
      };
    },
  ]);
