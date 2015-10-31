(function() {
  'use strict';

  angular
      .module('mohican')
      .factory('mnPing', ['$http', '$interval', 'mnNotify', mnPing]);

  function mnPing($http, $interval, mnNotify) {
    var service = {};
    service.offlineWarning = undefined;
    service.lastResponseStatus = 200;//initially assume that everything is ok
    service.start = function() {

      $interval(function() {
        if(service.lastResponseStatus !== 401) {
          $http.get('/ping.json').
                then(function (response) {
                  service.lastResponseStatus = response.status;
                  if(response.status === 200) {
                    if(service.offlineWarning) {
                      service.offlineWarning.dismiss();
                      service.offlineWarning = undefined;
                      mnNotify.clearReportConnectivityProblem();
                    }
                  }
                }).
                catch(function(error) {
                  service.lastResponseStatus = error.status;
                  if(error.status === 401) {
                    mnNotify.report(error.status).then(function(user) {
                      //back to ok status if user is signed in successfully
                      service.lastResponseStatus = 200;
                      mnNotify.clear();
                    });
                    if(service.offlineWarning) {
                      service.offlineWarning.dismiss();
                      service.offlineWarning = undefined;
                      mnNotify.clearReportConnectivityProblem();
                    }
                  }
                  else {
                    if(!service.offlineWarning) {
                      var warn = mnNotify.reportConnectivityProblem();
                      service.offlineWarning = warn.message;
                    }
                  }

                });
        }
      }, 5000);
    };
    return service;
  }

})();
