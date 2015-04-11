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
      .module('groupsRouteModule', [
        'ui.router',
        'baseRouteModule',
        'groupsControllerModule',
      ]).
      config(['$stateProvider',
        function groupsRoute($stateProvider) {
          $stateProvider.state('base.groups', {
            url: '/groups',
            templateUrl: 'app/routes/resources/groups/template.html',
            controller: 'GroupsController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
