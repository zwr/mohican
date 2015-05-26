//= require_self
//= require_tree ./routes

(function() {
  'use strict';

  angular.module('id5', ['mohican']).
          config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
              $urlRouterProvider.otherwise('/start');
              $stateProvider.state('base', {
                abstract: true,
                url: '',
                views: {
                  '': { template: '<ui-view/>' },
                },
                //util makes an array of default services resolvers for all routes
                //which will be injected into specific route controllers
                //resolve: window.MohicanUtils.makeDefaultServiceResolvers(),
              });
            },
          ]);
})();
