//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('historyService', ['mnBaseService', HistoryService]);

  function HistoryService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
