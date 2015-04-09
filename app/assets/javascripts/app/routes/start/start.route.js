//= require angular
//= require includes/angular-ui-router
//= require angular-rails-templates
//= require app/routes/base.route
//= require ./start.controller
//= require ./start.template
//= require_self

(function() {
  'use strict';

  angular.module('startRouteModule', [
    'ui.router',
    'templates',
    'baseRouteModule',
    'startRouteModule',
    'startControllerModule',
  ]).
  config(['$stateProvider',
    function startRoute($stateProvider) {
      $stateProvider.state('base.start', {
        url: '/',
        templateUrl: 'app/routes/start/start.template.html',
        controller: 'StartController',
        controllerAs: 'vm',
      });
    },
  ]);
})();
