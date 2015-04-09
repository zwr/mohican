//= require angular
//= require mohican/lib

(function() {
  'use strict';

  angular
      .module('actServiceModule', [
        'mohican',
      ])
      .factory('actService', ['mnBaseService', actService]);

  function actService(mnBaseService) {
    var service = {};

    mnBaseService.extendsTo(service);

    return service;
  }
})();
