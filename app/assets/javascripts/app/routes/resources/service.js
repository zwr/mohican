//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('resourcesService', ['mnBaseService', ResourcesService]);

  function ResourcesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
