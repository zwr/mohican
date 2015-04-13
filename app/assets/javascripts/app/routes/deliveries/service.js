//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('deliveriesService', ['mnBaseService', DeliveriesService]);

  function DeliveriesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
