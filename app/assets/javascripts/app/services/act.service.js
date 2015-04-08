//= require angular
//= require mohican/lib

(function() {
  'use strict';

  angular
      .module('actServiceModule', [
        'mohican',
      ])
      .factory('actService', actService);

  actService.$inject = ['mnBaseService'];

  function actService(mnBaseService) {
    var service = {};

    mnBaseService.extendsTo(service);

    return service;
  }
})();
