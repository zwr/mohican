//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    routeName:  'begin',
    controller: ['mnRouter', function(mnRouter) {
      mnRouter.redirectTo('start');
    }],
    template: null
  });
}]);
