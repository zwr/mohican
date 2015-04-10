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
      .module('customersRouteModule', [
        'ui.router',
        'baseRouteModule',
        'customersControllerModule',
      ]).
      config(['$stateProvider',
        function customersRoute($stateProvider) {
          $stateProvider.state('base.customers', {
            url: '/customers',
            templateUrl: 'app/routes/customers/template.html',
            controller: 'CustomersController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
