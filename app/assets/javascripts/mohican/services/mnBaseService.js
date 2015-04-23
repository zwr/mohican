(function() {
  'use strict';

  angular
      .module('mohican.services')
      .factory('mnBaseService', ['$q', mnBaseService]);

  function mnBaseService($q) {
    var _service = {
      pageItems: _pageItems,
      extendsTo: _extendsTo,
    };

    return _service;

    function _pageItems() {
      var deferred = $q.defer();

      deferred.resolve([
        { id: 1, departureCityAddress: 'sample data' },
        { id: 2, departureCityAddress: 'sample data' },
        { id: 3, departureCityAddress: 'sample data' },
        { id: 4, departureCityAddress: 'sample data' },
        { id: 5, departureCityAddress: 'sample data' },
      ]);

      return deferred.promise;
    }

    function _extendsTo(obj) {
      return angular.copy(_service, obj);
    }
  }
})();
