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
      .module('hoursReportsRouteModule', [
        'ui.router',
        'baseRouteModule',
        'hoursReportsControllerModule',
      ]).
      config(['$stateProvider',
        function hoursReportsRoute($stateProvider) {
          $stateProvider.state('base.hoursReports', {
            url: '/hours-reports',
            templateUrl: 'app/routes/resources/hoursReports/template.html',
            controller: 'HoursReportsController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
