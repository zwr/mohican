//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require_tree ./includes
//= require ./utils/utilBase
//= require ./routes/base.route
//= require ./services/base.service
//= require ./directives/base.directive
//= require_tree ./oldDirectives
//= require_self

(function() {
  'use strict';

  angular.module('mohican', [
    'ui.bootstrap',
    'templates',
    'ui.router',
    'isteven-multi-select',
    'mohican.routes',
    'mohican.services',
    'mohican.directives',
    'mnOldDirectives',
  ]);
})();
