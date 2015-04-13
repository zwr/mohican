//= require_tree .
//= require_self

(function() {
  'use strict';

  angular
      .module('routesModule', [])
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
            resolve: window.MohicanUtils.makeDefaultServiceResolvers(),
          });
        },
      ]);
})();
