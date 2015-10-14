//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    routeName:  'Start',
    default:    true,
    controller: function() {}
  });
}]);
