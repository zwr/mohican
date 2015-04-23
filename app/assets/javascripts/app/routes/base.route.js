//= require_tree .
//= require_self

(function() {
  'use strict';

  angular
      .module('id5.routes', [])
      .config([
        '$stateProvider',
        '$urlRouterProvider',
        function baseRoute($stateProvider, $urlRouterProvider) {
          $urlRouterProvider.otherwise('/start');
          $stateProvider.state('base', {
            abstract: true,
            url: '',
            views: {
              '': {
                template: '<ui-view/>',
              },
            },
            //util makes an array of default service resolvers for all routes
            //which will be injected into sepecific route controllers
            resolve: window.MohicanUtils.makeDefaultServiceResolvers(),
          });
        },
      ]);
})();
