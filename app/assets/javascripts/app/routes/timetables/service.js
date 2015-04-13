//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('timetablesService', ['mnBaseService', TimetablesService]);

  function TimetablesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
