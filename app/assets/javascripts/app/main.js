//= require angular
//= require angular-ui-bootstrap

//= require ./config/main.config
//= require ./routes/start/start.route
//= require ./routes/map/map.route

//= require angular-rails-templates
//= require_tree ./components

(function() {
  'use strict';

  angular.module('id5', [
    'templates',
    'ui.bootstrap',
    'mainConfigModule',
    'startRouteModule',
    'mapRouteModule',
  ]);
})();
