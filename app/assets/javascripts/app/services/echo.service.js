//= require angular

(function() {
  'use strict';

  angular
      .module('echoServiceModule', [])
      .factory('echoService', ['$q', echoService]);

  function echoService($q) {
    var service = {
      echo: _echo,
    };

    return service;

    function _echo(text) {
      var deferred = $q.defer();

      deferred.resolve(text);

      return deferred.promise;
    }
  }
})();
