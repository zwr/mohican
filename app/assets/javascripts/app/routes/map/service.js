//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('mapService', ['mnBaseService', MapService]);

  function MapService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
