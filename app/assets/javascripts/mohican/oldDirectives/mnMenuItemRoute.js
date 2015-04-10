angular.module('mnOldDirectives')
  .directive('mnMenuItemRoute', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          sref: '@?',
        },
        transclude: true,
        template: '<a ui-sref="{{sref}}" ng-transclude></a>',
        controller: ['$scope', function($scope) {
            $scope.sref = $scope.sref || 'base.start';
          },
        ],
      };
    },
  ]);
