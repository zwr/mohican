//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('designService', ['mnBaseService', DesignService]);

  function DesignService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
