//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require_tree ./includes
//= require ./routes/base.route
//= require ./services/base.service
//= require ./directives/base.directive
//= require ./utils/utilBase
//= require_tree ./oldDirectives
//= require_self

(function() {
  'use strict';

  angular.module('mohican', [
    'ui.bootstrap',
    'templates',
    'ui.router',
    'mohican.routes',
    'mohican.services',
    'mohican.directives',
    'mnOldDirectives',
  ]);
})();
