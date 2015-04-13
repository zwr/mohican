//= require_self

(function() {
  'use strict';

  angular
      .module('id5.services')
      .factory('activitiesService', ['mnBaseService', '$http', '$q', ActivitiesService]);

  function ActivitiesService(mnBaseService, $http, $q) {
    var service = {};
    mnBaseService.extendsTo(service);

    service.layout = null;
    service.buffer = null;
    service.pageSize = 20;

    service.getItem = function(id) {
      if(service.buffer) {
        for(var i = 0; i < service.buffer.length; i++) {
          if(service.buffer[i].Order_ID === id) {
            return $q.when(service.buffer[i]);
          }
        }
        return $q.when(null);
      } else {
        return service._fetchData()
          .then(function() {
            return service.getItem(id);
          });
      }
    };

    service.getPage = function(pageNo) {
      if(service.buffer) {
        return $q.when(service.buffer.slice((pageNo - 1) * service.pageSize, pageNo * service.pageSize));
      } else {
        return service._fetchData()
          .then(function() {
            return service.getPage(pageNo);
          });
      }
    };

    service.getPageCount = function() {
      if(service.buffer) {
        return $q.when(parseInt((service.buffer.length - 1) / service.pageSize + 1));
      } else {
        return service._fetchData()
          .then(function() {
            return service.getPageCount();
          });
      }
    };

    service.getLayoutDefinitions = function() {
      if(service.buffer) {
        return $q.when(service.layout);
      } else {
        return service._fetchData()
          .then(function() {
            return service.getLayoutDefinitions();
          });
      }
    };

    service._fetchData = function() {
      return $http.get('/api/activities')
        .then(function(responseActivities) {
          service.buffer = responseActivities.data.items;
          return $http.get('/api/activities/layout')
          .then(function(responseLayout) {
            service.layout = responseLayout.data.layout;
          });
        });
    };
    return service;
  }
})();
