//= require angular
//= require ./services/mnBaseService
//= require ./services/mnTranslations

//= require angular-rails-templates
//= require_tree ./oldDirectives

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// for time being, translate by doing nothing. Later
// we can add more.
function t(s) {
    return s;
}

(function() {
  'use strict';

  angular.module('mohican', [
    'mnOldDirectives',
    'mnBaseServiceModule',
    'mnTranslationsModule',
  ]);
})();
