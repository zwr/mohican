//= require_self
//= require ./config/main.config
//= require ./services/base.service
//= require ./routes/base.route
//= require ./directives/base.directive

(function() {
  'use strict';

  angular.module('id5', [
    'mohican',
    'id5.services',
    'id5.directives',
    'id5.routes',
  ]);
})();
