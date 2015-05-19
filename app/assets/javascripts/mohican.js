//= require ./mohican/config
//= require jquery
//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates

//= require ./mohican/lib/lodash
//= require ./mohican/lib/angular-ui-router
//= require ./mohican/lib/moment
//= require ./mohican/lib/daterangepicker
//= require ./mohican/lib/angular-daterangepicker
//= require ./mohican/lib/angular-multi-select

//= require ./mohican/utils/base.util
//= require ./mohican/services/base.service
//= require ./mohican/directives/base.directive
//= require_tree ./mohican/oldDirectives
//= require_tree ./mohican
//= require_self

(function() {
  'use strict';

  var interceptor = ['$q', function($q) {
    return {
      response: function(response) {
            if (response.status === 401) {
              window.location.replace('/users/sign_in');
              return null;
            }
            return response || $q.when(response);
        },
      responseError: function(rejection) {
        // do something on error
        if (rejection.status === 401) {
          window.location.replace('/users/sign_in');
          return null;
        }
        return $q.reject(rejection);
      },
    };
  }];

  angular.module('mohican', [
    'ui.bootstrap',
    'templates',
    'ui.router',
    'isteven-multi-select',
    'daterangepicker',
    'mohican.routes',
    'mohican.services',
    'mohican.directives',
    'mnOldDirectives',
  ]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(interceptor);
  }]);
})();
