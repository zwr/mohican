//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('routesService', ['mnBaseService', RoutesService]);

  function RoutesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
