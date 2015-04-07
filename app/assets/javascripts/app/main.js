//= require angular
//= require ./config/main.config
//= require ./routes/start/start.route
//= require ./routes/map/map.route
//= require_self

//= require angular-rails-templates
//= require_tree ./components

angular.module('id5', [
  'templates',
  'mainConfigModule',
  'startRouteModule',
  'mapRouteModule',
]);
