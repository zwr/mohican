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
      .module('transitionsRouteModule', [
        'ui.router',
        'baseRouteModule',
        'transitionsControllerModule',
      ]).
      config(['$stateProvider',
        function transitionsRoute($stateProvider) {
          $stateProvider.state('base.transitions', {
            url: '/transitions',
            templateUrl: 'app/routes/deliveryAndTransitions/transitions/template.html',
            controller: 'TransitionsController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
