//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require_tree ./includes
//= require_tree ./services
//= require ./utils/utilBase
//= require_tree ./oldDirectives
//= require_self

(function() {
  'use strict';

  angular.module('mohican', [
    'ui.router',
    'mnRoutes',
    'mnOldDirectives',
    'mnBaseServiceModule',
  ]);
})();
