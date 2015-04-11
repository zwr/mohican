//= require angular
//= require angular-ui-bootstrap
//= require angular-rails-templates
//= require ./config/main.config
//= require ./routes/start/route
//= require ./routes/map/route
//= require ./routes/design/route
//= require ./routes/history/route
//= require ./routes/customers/route
//= require ./routes/deliveryAndTransitions/deliveries/route
//= require ./routes/deliveryAndTransitions/transitions/route
//= require ./routes/deliveryAndTransitions/routes/route
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
    'designRouteModule',
    'historyRouteModule',
    'customersRouteModule',
    'deliveriesRouteModule',
    'transitionsRouteModule',
    'routesRouteModule',
  ]);
})();
