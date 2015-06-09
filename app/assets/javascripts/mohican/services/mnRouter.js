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
        //util makes an array of default services resolvers for all routes
        //which will be injected into specific route controllers
        //resolve: window.MohicanUtils.makeDefaultServiceResolvers(),
      });
    };
    this.$get = [function() {
      function addResouceRoute(route) {
        MohicanUtils.defineMohicanRoute(route, $stateProviderRef);
      }

      return {
        addResouceRoute: addResouceRoute,
      };
    }];
  }

})(window.MohicanUtils);
