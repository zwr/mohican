//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('customersService', ['mnBaseService', CustomersService]);

  function CustomersService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
