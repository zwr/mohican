#= require angular
#= require angular-route
#= require angular-resource
#= require angular-rails-templates
#= require_tree ./templates
#= require_self
#= require_tree ./includes
#= require_tree ./directives
#= require_tree ./services
#= require_tree ./controllers
#= require angular-ui-bootstrap

@id5_module = angular.module('id5', [
  'ngRoute', 
  'ngResource', 
  'templates',
  'ui.bootstrap',
  'LocalStorageModule',
  ])

@id5_module.config(['$routeProvider', ($routeProvider) ->
  $routeProvider.
    #when('/url', {
    #  templateUrl: 'template.html',
    #}).
    otherwise({
      templateUrl: 'home.html',
    }) 
])

@id5_module.config(['localStorageServiceProvider', (localStorageServiceProvider) ->
  localStorageServiceProvider
    .setPrefix('id5')
    .setStorageType('localStorage')
    .setStorageCookie(0, '<path>')
    .setNotify(true, true)
])
