//= require angular
//= require includes/angular-ui-router
//= require ./start.controller
// = require app/routes/base.route

angular.module('startRouteModule', [
  'ui.router',
  // 'baseRouteModule',
  'startRouteModule',
  'startControllerModule',
]).
config(['$stateProvider',
  function startRoute($stateProvider) {
    'use strict';
    $stateProvider.state('start', {
      url: '/',
      template: '<div>START</div>',
      controller: 'StartController',
      controllerAs: 'start',
    });
  },
]);
