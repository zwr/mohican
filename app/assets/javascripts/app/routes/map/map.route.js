//= require angular
//= require includes/angular-ui-router
//= require ./map.controller
//= require app/routes/base.route

angular.module('mapRouteModule', [
  'ui.router',
  'baseRouteModule',
  'mapRouteModule',
  'mapControllerModule',
]).
config(['$stateProvider',
  function mapRoute($stateProvider) {
    'use strict';
    $stateProvider.state('base.map', {
      url: '/map',
      template: '<div>MAP</div>',
      controller: 'MapController',
      controllerAs: 'map',
    });
  },
]);
