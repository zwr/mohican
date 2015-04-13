//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('deliveriesService', ['mnBaseService', DeliveriesService]);

  function DeliveriesService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
