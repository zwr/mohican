//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('groupsService', ['mnBaseService', GroupsService]);

  function GroupsService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
