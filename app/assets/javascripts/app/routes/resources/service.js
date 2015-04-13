//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('resourcesService', ['mnBaseService', ResourcesService]);

  function ResourcesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
