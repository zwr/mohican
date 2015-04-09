//= require angular
//= require includes/angular-ui-router
//= require_self

(function() {
  'use strict';
  angular.module('mainConfigModule', [
    'ui.router',
  ]).config(['$locationProvider',
    function locationProviderConfig($locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
    },
  ]);
})();
