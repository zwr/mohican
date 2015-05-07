//= require_self

(function(mnUtil) {
  'use strict';

  var DEBUG = false;
  function trace(text) {
    if(DEBUG) {
      console.log(text);
    }
  }

  var ROUTE_NAME = 'activities';
  var Controller = function(resolve, mnGridFilterService, $stateParams, $state, $scope) {
    _.assign(this, mnUtil.mnBaseController);
    this.initialize(resolve, mnGridFilterService, $stateParams, $state, $scope);
    this.loadData();
  };

  Controller.$inject = [ROUTE_NAME + 'ServiceResolve', 'mnGridFilterService', '$stateParams', '$state', '$scope'];

  //arguments: (routeName, controller, service)
  mnUtil.defineMohicanRoute(
    ROUTE_NAME,
    Controller,
    function (mnBaseService, $http, $q) {
      var service = {};
      // We will activate the following later
      // mnBaseService.extendsTo(service);

      service.buffer = null;
      service.bufferView = null;
      // Following is used to calculate the actual index of the required element
      service.pageSize = 20;
      // Following points out in which direction to grow the buffer. First it will
      // actually move forward, as this flag is flipped before the http request
      // is sent.
      service.nextEagerGrowthForward = false;
      // Following constant shows the size of fetch. It must by all means be
      // larger than pageSize
      service.fetchSize = 100;
      service.firstFetchSize = 200;
      // Following is the bottom and top index of the buffer data. At some point,
      // when it is completelly loaded, these two will be 0 and totalCount.
      // Indexes are zero based, which means that when the eager loading is
      // complete, topIndex == totalCount - 1.
      service.bottomIndex;
      service.topIndex;
      service.totalCount;
      // Following is the ongoing promise. This is the only promise that can
      // run against the server. If this is already take (not null), we need to
      // wait for it to fulfill and only .then set our own promise.
      service.thePromise = null;
      // Following is set to true when eager loading starts. Setting this to false
      // interupts eager loading, so that we can start it all over again. See
      // where it is set to false to understand why we would do it.
      service.beEager = false;
      // Following becomes true when all the filter records have been retrieved
      service.fullyLoaded = false;

      service._sort = function(collection, prop, asc) {
        collection = collection.sort(function(a, b) {
          if (asc) {return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0); }
          else {return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0); }
        });
        return collection;
      };

      service._filter = function(collection, filters) {
        collection = collection.filter(function(item) {
          var filtered = true;
          for (var key in filters) {
            if (filters.hasOwnProperty(key)) {
              if(angular.isDefined(item[key])) {
                filtered = filtered && (!!item[key]) && item[key].toString().includes(filters[key]);
                if(!filtered) {
                  break;
                }
              } else {
                filtered = false;
                break;
              }
            }
          }
          return filtered;
        });
        return collection;
      };

      service.getClientPage = function(pageNumber, column, direction, filters) {
        service.bufferView = _.cloneDeep(service.buffer);
        service.bufferView = service._filter(service.bufferView, filters);
        service.bufferView = service._sort(service.bufferView, column, direction === 'asc' ? true : false);

        var viewPagesCount = parseInt(
          (service.bufferView.length - 1) / service.pageSize + 1);

        return $q.when({
          items: service.bufferView.slice(
            (pageNumber - 1) * service.pageSize - service.bottomIndex,
            pageNumber * service.pageSize - service.bottomIndex
          ),
          pagesCount: viewPagesCount,
        });
      };

      // pageNumber is 1 based!
      service.getBackendPage = function(pageNumber) {
        // If we have the page, return the page
        if((pageNumber - 1) * service.pageSize >= service.bottomIndex
           && pageNumber * service.pageSize - 1 <= service.topIndex) {
          trace('got page ' + pageNumber);
          return $q.when(service.buffer.slice(
            (pageNumber - 1) * service.pageSize - service.bottomIndex,
            pageNumber * service.pageSize - service.bottomIndex
          ));
        } else {
          return service.fetchEagerly((pageNumber - 1) * service.pageSize)
          .then(function() {
            return service.getBackendPage(pageNumber);
          });
        }
      };

      service.fetchEagerly = function(startIndex) {
        //reset the buffer with the following command
        service.fullyLoaded = false;
        // if there is an ongoing promise, wait for it to complete after making
        // sure there will be no continuation
        if(service.thePromise != null) {
          service.beEager = false;
          return service.thePromise.then(function() {
            return service.fetchEagerly(startIndex);
          });
        } else {
          // fetch now, and then continue eagerly
          service.beEager = true;
          trace('get  offset = ' + startIndex
            + ' count = ' + service.firstFetchSize);
          return service.thePromise = $http.get('/api/activities?offset=' +
              startIndex + '&count=' + service.firstFetchSize)
            .then(function(resp) {
              trace('  -  received');
              service.thePromise = null;
              service.buffer = resp.data.items;
              service.totalCount = resp.data.total_count;
              service.bottomIndex = resp.data.offset;
              service.topIndex = service.bottomIndex + resp.data.items.length;
              service.continueEagerly();
              return service.buffer;
            });
        }
      };

      service.getBackendPageCount = function() {
        if(service.buffer) {
          var pageCount = parseInt(
            (service.totalCount - 1) / service.pageSize + 1);
          trace('got page count ' + pageCount
            + ' item count = ' + service.totalCount);
          return $q.when(pageCount);
        } else if(service.thePromise) {
          return service.thePromise.then(function() {
            // Somebody is already getting something, which will probably
            // do what we need, so just wait for that promise to fullfil and
            // then try again the same.
            return service.getBackendPageCount();
          });
        } else {
          return service.getBackendPage(1)
            .then(function() {
              return service.getBackendPageCount();
            });
        }
      };

      Array.prototype.append = function(other_array) {
        other_array.forEach(function(v) {this.push(v)}, this);
        return this;
      };

      service.continueEagerly = function() {
        if(service.beEager) {
          if(service.bottomIndex === 0) {
            service.nextEagerGrowthForward = true;
          } else if(service.topIndex === service.totalCount - 1) {
            service.nextEagerGrowthForward = false;
          } else {
            service.nextEagerGrowthForward = !service.nextEagerGrowthForward;
          }
          // now find start and count
          var count = service.fetchSize;
          var start;
          if(service.nextEagerGrowthForward) {
            start = service.topIndex;
            if(service.totalCount - service.topIndex < count) {
              count = service.totalCount - service.topIndex;
            }
          } else {
            start = service.bottomIndex - service.fetchSize;
            if(start < 0) {
              // note that start is negative, so this lowers the count
              count += start;
              start = 0;
            }
          }
          if(count === 0) {
            service.fullyLoaded = true;
            trace('data are fully loaded');
            return;
          }
          trace('get  offset = ' + start
            + ' count = ' + count);
          service.thePromise = $http.get('/api/activities?offset='
              + start + '&count=' + count)
            .then(function(resp) {
              service.thePromise = null;
              trace('  -  received');
              // if we were told to stop, just do nothing
              if(service.beEager) {
                if(service.nextEagerGrowthForward) {
                  service.topIndex += resp.data.items.length;
                  service.buffer.append(resp.data.items);
                } else {
                  service.bottomIndex -= resp.data.items.length;
                  service.buffer = resp.data.items.append(service.buffer);
                }
                service.continueEagerly();
              }
            });
        }
      };

      // layout getting is completelly independent
      service.layout = null;
      service.theLayoutPromise = null;
      service.getPreviewDefinitions = function() {
        if(service.layout) {
          return $q.when(service.layout);
        } else if(service.theLayoutPromise) {
          return service.theLayoutPromise.then(function() {
            service.getPreviewDefinitions();
          });
        } else {
          trace('get  layout');
          return service.getLayoutPromise = $http.get('/api/activities/layout')
            .then(function(resp) {
              trace('  -  layout received');
              service.getLayoutPromise = null;
              service.layout = resp.data.layout;
              return service.layout;
            });
        }
      };

      return service;
    }
  );
})(window.MohicanUtils);
