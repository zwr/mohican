//= require angular

(function() {
  'use strict';
  angular.module('echoServiceModule', []).factory('Echo', [
    '$q',
    function Echo($q) {
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
})();
