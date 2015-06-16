//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'start',
    //default:    true,
    controller: function() {}
  });

  mnRouterProvider.addRedirecRoute({
    name:       null,
    redirectTo: 'start'
  });
}]);
