//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('hoursReportsService', ['mnBaseService', HoursReportsService]);

  function HoursReportsService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
