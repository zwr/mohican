//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('mapService', ['mnBaseService', MapService]);

  function MapService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
