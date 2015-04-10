//= require angular
//= require includes/angular-ui-router
//= require angular-rails-templates
//= require app/routes/base.route
//= require ./map.controller
//= require ./map.template
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
            templateUrl: 'app/routes/map/map.template.html',
            controller: 'MapController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
