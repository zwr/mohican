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
      .module('designRouteModule', [
        'ui.router',
        'baseRouteModule',
        'designControllerModule',
      ]).
      config(['$stateProvider',
        function designRoute($stateProvider) {
          $stateProvider.state('base.design', {
            url: '/design',
            templateUrl: 'app/routes/design/template.html',
            controller: 'DesignController',
            controllerAs: 'vm',
          });
        },
      ]);
})();
