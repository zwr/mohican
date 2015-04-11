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
      .module('deliveriesRouteModule', [
        'ui.router',
        'baseRouteModule',
        'deliveriesControllerModule',
      ]).
      config(['$stateProvider',
        function deliveriesRoute($stateProvider) {
          $stateProvider.state('base.deliveries', {
            url: '/deliveries',
            templateUrl: 'app/routes/deliveryAndTransitions/deliveries/template.html',
            controller: 'DeliveriesController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
