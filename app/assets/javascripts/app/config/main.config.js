//= require_self

(function() {
  'use strict';
  angular.module('mainConfigModule', []).
      config(['$locationProvider',
        function locationProviderConfig($locationProvider) {
          $locationProvider.html5Mode(true).hashPrefix('!');
        },
      ]);
})();
