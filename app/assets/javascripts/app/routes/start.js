//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'start',
    default:    true,
    controller: function() {}
  });

  //other way to create default route,
  //just redirect null route to one of predefines
  // mnRouterProvider.addRedirecRoute({
  //   name:       null,
  //   redirectTo: 'start'
  // });
}]);
