(function() {
  'use strict';

  angular
      .module('mohican')
      .factory('mnPing', ['$http', '$interval', 'mnNotify', mnPing]);

  function mnPing($http, $interval, mnNotify) {
    var service = {};
    service.start = function() {
      $interval(function() {
        $http.get('/ping.json').
              then(function (response) {
                if(response.status === 200) {
                  mnNotify.clear();
                }
                else {
                  mnNotify.report(response.status).then(function() {
                    console.log('ping resolve success');
                  });
                }
              }).
              catch(function(error) {
                mnNotify.report(error.status).then(function() {
                  console.log('ping resolve error');
                });
              });
      }, 1000);
    };
    return service;
  }

})();
