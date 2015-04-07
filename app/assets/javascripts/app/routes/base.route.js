//= require angular
//= require includes/angular-ui-router
//= require app/services/echo.service

angular.module('baseRouteModule', [
  'ui.router',
  'echoServiceModule',
]).config([
  '$stateProvider',
  function baseRoute($stateProvider) {
    'use strict';
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
