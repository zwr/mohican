//= require angular
//= require angular-rails-templates
//= require ./template

angular.module('mnAppHeaderModule', [
    'templates',
  ])
  .directive('mnAppHeader', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/components/appHeader/template.html',
      };
    },
  ]);
