//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('hoursAccountingService', ['mnBaseService', HoursAccountingService]);

  function HoursAccountingService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
