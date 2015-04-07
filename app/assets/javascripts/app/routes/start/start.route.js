//= require angular
//= require includes/angular-ui-router
//= require ./start.controller
//= require app/routes/base.route

angular.module('startRouteModule', [
  'ui.router',
  'baseRouteModule',
  'startRouteModule',
  'startControllerModule',
]).
config(['$stateProvider',
  function startRoute($stateProvider) {
    'use strict';
    $stateProvider.state('base.start', {
      url: '/',
      template: '<div>{{start.echo}}</div>',
      controller: 'StartController',
      controllerAs: 'start',
    });
  },
]);
