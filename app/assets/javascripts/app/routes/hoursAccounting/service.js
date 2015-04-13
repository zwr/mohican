//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('hoursAccountingService', ['mnBaseService', HoursAccountingService]);

  function HoursAccountingService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
