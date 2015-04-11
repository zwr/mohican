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
      .module('linksRouteModule', [
        'ui.router',
        'baseRouteModule',
        'linksControllerModule',
      ]).
      config(['$stateProvider',
        function linksRoute($stateProvider) {
          $stateProvider.state('base.links', {
            url: '/links',
            templateUrl: 'app/routes/resources/links/template.html',
            controller: 'LinksController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
