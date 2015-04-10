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
      .module('mapRouteModule', [
        'ui.router',
        'baseRouteModule',
        'mapControllerModule',
      ]).
      config(['$stateProvider',
        function mapRoute($stateProvider) {
          $stateProvider.state('base.map', {
            url: '/map',
            templateUrl: 'app/routes/map/template.html',
            controller: 'MapController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
