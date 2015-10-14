//= require_self

angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    routeName:  'begin',
    controller: function($injector) {
      $injector.get('mnRouter').redirectTo('start');
    },
    template: null
  });
}]);
