//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'Start',
    default:    true,
    controller: function() {}
  });
}]);
