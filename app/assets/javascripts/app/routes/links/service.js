//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('linksService', ['mnBaseService', LinksService]);

  function LinksService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
