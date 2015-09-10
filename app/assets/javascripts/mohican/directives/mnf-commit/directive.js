//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfCommit', [function() {
      'use strict';
      return {
        scope:       {},
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-commit/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.mnfFormCtrl = mnfFormCtrl;
        },

        controller: ['$scope', 'mnRouter', function($scope, mnRouter) {
          $scope.commitDoc = function() {
            $scope.mnfDoc.commit().then(function() {
              console.log($scope.mnfDoc);
              if($scope.mnfDoc._added) {
                mnRouter.redirectTo(mnRouter.currentRouteIndex());
              }
            });
          };
        }]
      };
    }
  ]);
