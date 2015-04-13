//= require ./config/main.config
//= require ./services/base.service
//= require ./routes/base.route
//= require ./components/id5AppHeader/directive
//= require_self

(function() {
  'use strict';

  angular.module('id5', [
    'mohican',
    'mainConfigModule',
    'servicesModule',
    'routesModule',
    'id5AppHeaderModule',
  ]);
})();
