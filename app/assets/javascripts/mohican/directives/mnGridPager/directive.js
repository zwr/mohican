//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnGridPager', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope: {
          pageChanged: '&',
          pagesCount: '=',
          currentPage: '=',
          clientViewPagerStyle: '=',
        },
        templateUrl: 'mohican/directives/mnGridPager/template.html',
        controller: 'MnGridPagerController',
        controllerAs: 'gridPager',
        bindToController: true,
      };
    },
  ]);
