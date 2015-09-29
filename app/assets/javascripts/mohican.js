//= require ./mohican/config
//= require jquery
//= require angular
//= require angular-animate
//= require angular-rails-templates

//= require ./mohican/lib/lodash
//= require ./mohican/lib/angular-ui-router
//= require ./mohican/lib/ui-bootstrap-tpls
//= require ./mohican/lib/moment
//= require ./mohican/lib/daterangepicker
//= require ./mohican/lib/angular-daterangepicker
//= require ./mohican/lib/angular-multi-select

//= require_tree ./mohican/templates
//= require ./mohican/globals/base.globals
//= require ./mohican/mixins/base.mixins
//= require_self
//= require ./mohican/services/base.service
//= require ./mohican/directives/base.directive


(function() {
  'use strict';

  var interceptor = ['$q', function($q) {
    return {
      response: function(response) {
            if (response.status === 401) {
              window.location.replace(window.MN_LOGIN);
              return null;
            }
            return response || $q.when(response);
        },
      responseError: function(rejection) {
        // do something on error
        if (rejection.status === 401) {
          window.location.replace(window.MN_LOGIN);
          return null;
        }
        return $q.reject(rejection);
      }
    };
  }];

  angular.module('mohican', [
    'ngAnimate',
    'ui.bootstrap',
    'templates',
    'ui.router',
    'isteven-multi-select',
    'daterangepicker'
  ]).config(['$httpProvider', '$provide', 'mnRouterProvider', '$urlRouterProvider', '$stateProvider',
    function($httpProvider, $provide, mnRouter, $urlRouterProvider, $stateProvider) {
      $httpProvider.interceptors.push(interceptor);

      //mnRouter needs references to state and route providers only available
      //from config phase
      mnRouter.init($urlRouterProvider, $stateProvider);

      //utility object which stores references to $provide's methods
      //we need this for runtime creating services/factories
      angular.module('mohican').register =
            {
                factory:  $provide.factory,
                service:  $provide.service,
                constant: $provide.constant
            };
    }
  ]).run(['mnRouter', 'mnPing', function(mnRouter, mnPing) {
    //in app run phase when we have all dependencies available for injecting
    //router can creates all previously added resource routes
    mnRouter.createAll();
    mnPing.start();
  }]);
})();
