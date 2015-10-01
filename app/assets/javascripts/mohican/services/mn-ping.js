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
                  mnNotify.clear();
                }
                else {
                  console.log('no 200 response');
                  // mnNotify.report(response.status).then(function() {
                  //   console.log('ping resolve success');
                  // });
                }
              }).
              catch(function(error) {
                if(error.status === 401) {
                  mnNotify.report(error.status).then(function() {
                    console.log('ping resolve error');
                  });
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
