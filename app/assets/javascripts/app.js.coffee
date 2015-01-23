#= require mohican
#= require_tree ./templates
#= require_self
#= require_tree ./includes
#= require_tree ./directives
#= require_tree ./services
#= require_tree ./controllers


@id5_module = angular.module('id5', [
  'ngRoute', 
  'ngResource', 
  'templates',
  'ui.bootstrap',
  'mohican',
  'multi-select',
  ])

@id5_module.config(['$routeProvider', ($routeProvider) ->
  $routeProvider.
    when('/:pageNo', {
      templateUrl: 'home.html',
    }).
    otherwise({
      redirectTo: '/1',
    }) 
])

###
@id5_module.config(['localStorageServiceProvider', (localStorageServiceProvider) ->
  localStorageServiceProvider
    .setPrefix('id5')
    .setStorageType('localStorage')
    .setStorageCookie(0, '<path>')
    .setNotify(true, true)
])
###
