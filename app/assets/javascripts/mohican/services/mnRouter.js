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
        views:    { '': { template: '<ui-view/>' } },
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

    this.$get = ['$stateParams', '$state', function($stateParams, $state) {
      function createAll() {
        provider.routes.forEach(function(route) {
          mohican.defineMohicanRoute(route, $stateProviderRef);
        });
      }

      return {
        createAll:    createAll,
        $stateParams: $stateParams,
        $state:       $state,
      };
    }];
  }

})(window.mohican);
