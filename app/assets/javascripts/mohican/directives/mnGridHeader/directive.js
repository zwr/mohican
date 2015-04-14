//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnGridHeader', [function() {
      'use strict';
      return {
        restrict: 'E',
        templateUrl: 'mohican/directives/mnGridHeader/template.html',
        controller: 'MnGridHeaderController',
        controllerAs: 'vm',
        bindToController: true,
      };
    },
  ]);
