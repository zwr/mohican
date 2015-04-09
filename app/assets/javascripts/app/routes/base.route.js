//= require angular
//= require includes/angular-ui-router
//= require app/services/echo.service
//= require app/services/act.service
//= require_self

(function() {
  'use strict';

  angular
      .module('baseRouteModule', [
        'ui.router',
        'echoServiceModule',
        'actServiceModule',
      ])
      .config([
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
              echoServiceResolve: [
                'echoService',
                function echoServiceResolver(echoService) {
                  return echoService;
                },
              ],
              actServiceResolve: [
                'actService',
                function actServiceResolver(actService) {
                  return actService;
                },
              ],
            },
          });
        },
      ]);
})();
