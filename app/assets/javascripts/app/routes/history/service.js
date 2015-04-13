//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('historyService', ['mnBaseService', HistoryService]);

  function HistoryService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
