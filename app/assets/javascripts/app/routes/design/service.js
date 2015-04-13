//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('designService', ['mnBaseService', DesignService]);

  function DesignService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
