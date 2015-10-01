(function() {
  'use strict';

  angular
      .module('mohican')
      .factory('mnPing', ['$http', '$interval', 'mnNotify', mnPing]);

  function mnPing($http, $interval, mnNotify) {
    var service = {};
    service.offlineWarning = undefined;
    service.start = function() {
      $interval(function() {
        $http.get('/ping.json').
              then(function (response) {
                if(response.status === 200) {
                  if(service.offlineWarning) {
                    service.offlineWarning.dismiss();
                    service.offlineWarning = undefined;
                  }
                }
              }).
              catch(function(error) {
                if(error.status === 401) {
                  mnNotify.report(error.status).then(function() {
                    mnNotify.clear();
                  });
                  if(service.offlineWarning) {
                    service.offlineWarning.dismiss();
                    service.offlineWarning = undefined;
                  }
                }
                else {
                  if(!service.offlineWarning) {
                    var warn = mnNotify.warning({
                      message:     'connectivity problem',
                      dismissable: false
                    });
                    service.offlineWarning = warn.message;
                  }
                }

              });
      }, 1000);
    };
    return service;
  }

})();
