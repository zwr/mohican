//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require ./mohican/config
//= require_tree ./mohican/lib
//= require ./mohican/utils/base.util
//= require ./mohican/services/base.service
//= require ./mohican/directives/base.directive
//= require_tree ./mohican/oldDirectives
//= require_tree ./mohican
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
