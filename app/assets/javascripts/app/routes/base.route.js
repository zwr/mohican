//= require angular
//= require includes/angular-ui-router
//= require app/services/echo.service

(function() {
  'use strict';
  angular.module('baseRouteModule', [
    'ui.router',
    'echoServiceModule',
  ]).config([
    '$stateProvider',
    function baseRoute($stateProvider) {
      $stateProvider.state('base', {
        abstract: true,
        url: '',
        views: {
          '': {
            template: '<ui-view/>',
          },
        },
        resolve: {
          echo: [
            'Echo',
            function echoServiceResolver(Echo) {
              return Echo;
            },
          ],
        },
      });
    },
  ]);
})();
