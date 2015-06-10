(function(MohicanUtils) {
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
      $urlRouterProvider.otherwise('/start');
      $stateProvider.state('base', {
        abstract: true,
        url:      '',
        views:    { '': { template: '<ui-view/>' } },
      });
    };

    provider.addResouceRoute = function(definition) {
      provider.routes.push(definition);
    };

    this.$get = [function() {
      function createAll() {
        provider.routes.forEach(function(route) {
          MohicanUtils.defineMohicanRoute(route, $stateProviderRef);
        });
      }

      return {
        createAll: createAll,
      };
    }];
  }

})(window.MohicanUtils);
