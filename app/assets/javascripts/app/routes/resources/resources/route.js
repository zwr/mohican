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
      .module('resourcesRouteModule', [
        'ui.router',
        'baseRouteModule',
        'resourcesControllerModule',
      ]).
      config(['$stateProvider',
        function resourcesRoute($stateProvider) {
          $stateProvider.state('base.resources', {
            url: '/resources',
            templateUrl: 'app/routes/resources/resources/template.html',
            controller: 'ResourcesController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
