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
      .module('routesRouteModule', [
        'ui.router',
        'baseRouteModule',
        'routesControllerModule',
      ]).
      config(['$stateProvider',
        function routesRoute($stateProvider) {
          $stateProvider.state('base.routes', {
            url: '/routes',
            templateUrl: 'app/routes/deliveryAndTransitions/routes/template.html',
            controller: 'RoutesController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
