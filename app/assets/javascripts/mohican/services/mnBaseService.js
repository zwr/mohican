//= require angular

(function() {
  'use strict';

  angular
      .module('mnBaseServiceModule', [])
      .factory('mnBaseService', mnBaseService);

      mnBaseService.$inject = ['$q'];

  function mnBaseService($q) {
    var _service = {
      pageItems: _pageItems,
      extendsTo: _extendsTo,
    };

    return _service;

    function _pageItems() {
      var deferred = $q.defer();

      deferred.resolve([
        { id: 1, departureCityAddress: 'TURKU' },
        { id: 2, departureCityAddress: 'PAROLA' },
        { id: 3, departureCityAddress: 'TURKU' },
        { id: 4, departureCityAddress: 'LAHTI' },
        { id: 5, departureCityAddress: 'TURKU' },
      ]);

      return deferred.promise;
    }

    function _extendsTo(obj) {
      return angular.copy(_service, obj);
    }
  }
})();
