//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('startService', ['mnBaseService', StartService]);

  function StartService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
