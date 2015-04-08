//= require angular
//= require ./services/mnBaseService

//= require angular-rails-templates
//= require_tree ./oldDirectives

(function() {
  'use strict';

  angular.module('mohican', [
    'mnOldDirectives',
    'mnBaseServiceModule',
  ]);
})();
