//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require ./config/main.config
//= require ./routes/start/start.route
//= require ./routes/map/map.route
//TODO find some better palce for layout templates loading
//= require ./components/appHeader/appHeader.template
//= require_self

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
