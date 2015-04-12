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
      .module('activitiesRouteModule', [
        'ui.router',
        'baseRouteModule',
        'activitiesControllerModule',
      ]).
      config(['$stateProvider',
        function activitiesRoute($stateProvider) {
          $stateProvider.state('base.activities', {
            url: '/activities',
            templateUrl: 'app/routes/activities/template.html',
            controller: 'ActivitiesController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
