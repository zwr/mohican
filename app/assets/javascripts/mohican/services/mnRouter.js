(function(mohican) {
  'use strict';

  angular
      .module('mohican.services')
      .provider('mnRouter', [mnRouter]);

  function mnRouter() {
    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;

    var provider = this;
    provider.routes = [];

    provider.init = function($urlRouterProvider, $stateProvider) {
      $urlRouterProviderRef = $urlRouterProvider;
      $stateProviderRef = $stateProvider;
      $stateProvider.state('base', {
        abstract: true,
        url:      '',
        views:    { '': { template: '<ui-view/>' } }
      });
    };

    provider.addResouceRoute = function(definition) {
      provider.routes.push(definition);
      if(angular.isDefined(definition.default)) {
        $urlRouterProviderRef.otherwise('/' + definition.name);
      }
    };

    provider.addSimpleRoute = function(definition) {
      provider.addResouceRoute(definition);
    };

    provider.addRedirecRoute = function(definition) {
      if(definition.name === null || definition.name === '') {
        $urlRouterProviderRef.otherwise('/' + definition.redirectTo);
      }
      else {
        provider.routes.push({
          name:       definition.name,
          redirectTo: definition.redirectTo
        });
      }
    };

    this.$get = ['$stateParams', '$state', function($stateParams, $state) {
      function createAll() {
        provider.routes.forEach(function(route) {
          mohican.defineMohicanRoute(route, $stateProviderRef);
        });
      }

      function redirectTo(routeName) {
        $state.go('base.' + routeName, $stateParams, {location: 'replace'});
      }

      return {
        createAll:    createAll,
        redirectTo:   redirectTo,
        $stateParams: $stateParams,
        $state:       $state
      };
    }];
  }

})(window.mohican);
