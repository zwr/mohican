(function() {
  'use strict';

  angular
      .module('mohican')
      .factory('mnDataPreloader', ['$injector', mnDataPreloader]);

  function mnDataPreloader($injector) {
    var service = {};
    service.load = function(routes) {
      routes.forEach(function(route) {
        $injector.get(route + 'Service').preloadAllData();
      });
    };
    return service;
  }

})();
