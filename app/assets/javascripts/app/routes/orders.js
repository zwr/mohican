//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addRedirecRoute({
    name:       'orders',
    redirectTo: 'activities'
  });
}]);
