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
      views: {
        '': {
          template: '<ui-view>ee</ui-view>',
        },
      },
      resolve: {
        echoService: [
          'EchoService',
          function echoServiceResolver(EchoService) {
            return EchoService.repeat('echo');
          },
        ],
      },
    });
  },
]);
