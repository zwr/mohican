//= require angular
//= require includes/angular-ui-router

var mainConfigModule = angular.module('mainConfigModule', [
  'ui.router',
]);

mainConfigModule.config(['$locationProvider',
  function($locationProvider) {
    'use strict';
    $locationProvider.html5Mode(true).hashPrefix('!');
  },
]);
