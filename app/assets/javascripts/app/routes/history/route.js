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
      .module('historyRouteModule', [
        'ui.router',
        'baseRouteModule',
        'historyControllerModule',
      ]).
      config(['$stateProvider',
        function historyRoute($stateProvider) {
          $stateProvider.state('base.history', {
            url: '/history',
            templateUrl: 'app/routes/history/template.html',
            controller: 'HistoryController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
