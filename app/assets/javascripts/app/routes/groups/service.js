//= require_self

(function() {
  'use strict';

  angular
      .module('servicesModule')
      .factory('groupsService', ['mnBaseService', GroupsService]);

  function GroupsService(mnBaseService) {
    var service = {};
    mnBaseService.extendsTo(service);

    return service;
  }
})();
