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
      .module('hoursAccountingRouteModule', [
        'ui.router',
        'baseRouteModule',
        'hoursAccountingControllerModule',
      ]).
      config(['$stateProvider',
        function hoursAccountingRoute($stateProvider) {
          $stateProvider.state('base.hoursAccounting', {
            url: '/hours-accounting',
            templateUrl: 'app/routes/resources/hoursAccounting/template.html',
            controller: 'HoursAccountingController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
