//= require angular
//= require_self

(function() {
  'use strict';

  angular
      .module('activitiesControllerModule', [])
      .controller('ActivitiesController', 
        ['ActivitiesService', ActivitiesController])
      .service('ActivitiesService', 
        ['$http', '$q', ActivitiesService]);

  function ActivitiesService ($http, $q) {
    var srv = this;
    srv.layout = null;
    srv.buffer = null;
    srv.page_size = 20;
    
    srv.getItem = function(id) {
      if(srv.buffer) {
        for(var i=0;i<srv.buffer.length;i++) {
          if(srv.buffer[i].Order_ID == id) {
            return $q.when(srv.buffer[i]);
          }
        }
        return $q.when(null);
      } else {
        return srv._fetchData()
          .then(function() {
            return srv.getItem(id);
          })
      }
    }
    
    srv.getPage = function(pageNo) {
      if(srv.buffer) {
        return $q.when(srv.buffer.slice((pageNo-1)*srv.page_size,
                                          pageNo*srv.page_size));
      } else {
        return srv._fetchData()
          .then(function() {
            return srv.getPage(pageNo);
          });
      }
    }
    
    srv.getPageCount = function() {
      if(srv.buffer) {
        return $q.when(parseInt(
          (srv.buffer.length -1) / srv.page_size + 1));
      } else {
        return srv._fetchData()
          .then(function() {
            return srv.getPageCount();
          });
      }
    }
    
    srv.getLayoutDefinitions = function() {
      if(srv.buffer) {
        return $q.when(srv.layout);
      } else {
        return srv._fetchData()
          .then(function() {
            return srv.getLayoutDefinitions();
          });
      }
    }
    
    srv._fetchData = function() {
      return $http.get('/activities')
        .then(function(response) {
          srv.buffer = response.data.items;
          return $http.get('/activities/layout')
          .then(function(response) {
            srv.layout = response.data.layout;
          });
        });
    };
    return srv;
  };

  function ActivitiesController(ActivitiesService) {
    var ctrl = this; // I think this is the scope, but it would be nicer
                 // to actually have it injected, and use $scope 
                 // everywhere instead of this or ctrl.
    ctrl.myPageItems = null;
    ctrl.totalPageCount = null;
    ctrl.myCurrentPage = 3; // this you should read form the address bar
                            // and default value is 1
    ctrl.myLayoutDefinitions = null;
    ActivitiesService.getPage(ctrl.myCurrentPage)
      .then(function(pageItems) {
        ctrl.myPageItems = pageItems;
        // And now, if there is ng-repeat="item in myPageItems"
        // in the tempalte, magic will happen!
      }); 
    ActivitiesService.getPageCount()
      .then(function(pageCount) {
        ctrl.totalPageCount = pageCount;
        // And this should be used by the footer controller,
        // which I have already made, so just steal it and make
        // it fit nice in to this new Mohican.
      }); 
    ActivitiesService.getLayoutDefinitions()
      .then(function(layoutDefinitions) {
        ctrl.myLayoutDefinitions = layoutDefinitions;
        // This contains layouts (two of them, default and short)
        // and it also contains empty lists of filters and sorts.
        // Ignore the other two, and use the first to draw a table.
      });
    return ctrl;
  }
})();
