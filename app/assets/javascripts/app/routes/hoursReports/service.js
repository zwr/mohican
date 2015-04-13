//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('hoursReportsService', ['mnBaseService', HoursReportsService]);

  function HoursReportsService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
