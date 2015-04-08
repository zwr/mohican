//= require angular
//= require includes/angular-ui-router
//= require ./map.controller
//= require app/routes/base.route

(function() {
  'use strict';
  angular.module('mapRouteModule', [
    'ui.router',
    'baseRouteModule',
    'mapRouteModule',
    'mapControllerModule',
  ]).
  config(['$stateProvider',
    function mapRoute($stateProvider) {
      $stateProvider.state('base.map', {
        url: '/map',
        template: '<div>MAP</div>',
        controller: 'MapController',
        controllerAs: 'map',
      });
    },
  ]);
})();
