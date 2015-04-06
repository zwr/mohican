//= require mohican/lib
//= require_self
//= require_tree ./app


this.id5_module = angular.module('id5', ['ngRoute', 'ngResource', 'templates', 'ui.bootstrap', 'mohican', 'multi-select']);

this.id5_module.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/:pageNo', {
      templateUrl: 'home.html'
    }).otherwise({
      redirectTo: '/1'
    });
  }
]);


/*
@id5_module.config(['localStorageServiceProvider', (localStorageServiceProvider) ->
  localStorageServiceProvider
    .setPrefix('id5')
    .setStorageType('localStorage')
    .setStorageCookie(0, '<path>')
    .setNotify(true, true)
])
 */
