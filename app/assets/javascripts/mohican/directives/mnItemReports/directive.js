//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnItemReports', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'mohican/directives/mnItemReports/template.html',
        controller: 'mnItemReportsController',
        controllerAs: 'itemReports',
        bindToController: true,
      };
    },
  ]);
