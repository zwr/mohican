//= require angular
//= require includes/angular-ui-router
//= require angular-rails-templates
//= require app/routes/base.route
//= require ./controller
//= require ./template
//= require_self

(function() {
  'use strict';

  angular
      .module('timetablesRouteModule', [
        'ui.router',
        'baseRouteModule',
        'timetablesControllerModule',
      ]).
      config(['$stateProvider',
        function timetablesRoute($stateProvider) {
          $stateProvider.state('base.timetables', {
            url: '/timetables',
            templateUrl: 'app/routes/resources/timetables/template.html',
            controller: 'TimetablesController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
