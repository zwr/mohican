//= require angular
//= require includes/angular-ui-router

(function() {
  'use strict';
  var mainConfigModule = angular.module('mainConfigModule', [
    'ui.router',
  ]);

  mainConfigModule.config(['$locationProvider',
    function locationProviderConfig($locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
    },
  ]);
})();
