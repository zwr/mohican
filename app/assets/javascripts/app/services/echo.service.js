//= require angular

angular.module('echoServiceModule', []).factory('Echo', [
  '$q',
  function Echo($q) {
    'use strict';
    function repeat(text) {
      var deferred = $q.defer();

      deferred.resolve(text);

      return deferred.promise;
    }

    return {
      repeat: repeat,
    };
  },
]);
