//= require angular
//= require ./config/main.config
//= require ./routes/start/start.route
//= require ./routes/map/map.route
//= require_self

angular.module('id5', [
  'mainConfigModule',
  'startRouteModule',
  'mapRouteModule',
]);
