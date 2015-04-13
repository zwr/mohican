//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('customersService', ['mnBaseService', CustomersService]);

  function CustomersService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
