//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('startService', ['mnBaseService', StartService]);

  function StartService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
