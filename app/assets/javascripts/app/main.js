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
//= require ./routes/activities/route
//= require ./routes/deliveryAndTransitions/routes/route
//= require ./routes/resources/groups/route
//= require ./routes/resources/hoursAccounting/route
//= require ./routes/resources/hoursReports/route
//= require ./routes/resources/links/route
//= require ./routes/resources/resources/route
//= require ./routes/resources/timetables/route
//= require ./components/appHeader/directive
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
    'activitiesRouteModule',
    'routesRouteModule',
    'groupsRouteModule',
    'hoursAccountingRouteModule',
    'hoursReportsRouteModule',
    'linksRouteModule',
    'resourcesRouteModule',
    'timetablesRouteModule',
    'mnAppHeaderModule',
  ]);
})();
