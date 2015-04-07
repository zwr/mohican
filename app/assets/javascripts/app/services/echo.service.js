//= require angular

angular.module('echoServiceModule', []).factory('EchoService', [
  '$q',
  function EchoService($q) {
    'use strict';
    function repeat(text) {
      var deferred = $q.defer();

      deferred.resolve(text);

      return deferred.promise;
    }

    return {
      get: repeat,
    };
  },
]);
