//= require angular
//= require includes/angular-ui-router
//= require angular-rails-templates
//= require app/routes/base.route
//= require ./controller
//= require ./template
//= require_self

(function() {
  'use strict';

  function mohicanRoute(routeName) {
    return function($stateProvider){
      $stateProvider.state('base.' + routeName, {
        url: '/#/' + routeName,
        templateUrl: 'app/routes/'+routeName+'/template.html',
        controller: capitalize(routeName) + 'Controller',
        controllerAs: 'vm',
      });
    }
  }

  function defineMohicanRoute(routeName) {
    angular
      .module(routeName + 'RouteModule', [
        'ui.router',
        'baseRouteModule',
        routeName + 'ControllerModule',
      ]).
      config(['$stateProvider', mohicanRoute(routeName)]);
  }
  
  defineMohicanRoute('activities');


})();
