//= require_self

(function(mnUtil) {
  'use strict';

  var DEBUG = true;
    function trace(text) {
      if(DEBUG) {
        console.log(text);
      }
    }

  //arguments: (routeName, controller, service)
  mnUtil.defineMohicanRoute(
    'activities',
    function(resolve, $stateParams, $state) {
      var ctrl = this;
      _initialize();

      function _initialize() {
        mnUtil.clearDefaultParameters($stateParams, $state);
        var initialParams = mnUtil.injectDefaultParameters($stateParams);

        ctrl.currentPage = initialParams.page;
        ctrl.layout = initialParams.layout;

        resolve.getPage(ctrl.currentPage).then(function(items) {
          ctrl.items = items;
        });

        resolve.getPageCount().then(function(pagesCount) {
          ctrl.pagesCount = pagesCount;
        });
        ctrl.layoutDefinitions = [];
        ctrl.layouts = [];
        resolve.getLayoutDefinitions().then(function(layoutDefinitions) {
          ctrl.layouts = layoutDefinitions.layouts;

          layoutDefinitions.layouts.forEach(function(layout) {
            ctrl.layoutDefinitions.push({
              name: layout.name,
              show: 'Layout: ' + layout.name,
              desc: 'Shows ' + layout.definition.length + ' fields',
              selected: layout.name === ctrl.layout,
            });
            if(layout.name === ctrl.layout) {
              ctrl.fields = layout.definition;
            }
          });
        });
      }

      function _getPage(page) {
        _validateParams($stateParams);
        var newRouteParams = _.clone($stateParams);
        newRouteParams.page = page.toString();
        $state.go($state.current.name, mnUtil.escapeDefaultParameters(newRouteParams));
      }

      function _getLayout(layout) {
        _validateParams($stateParams);
        var newRouteParams = _.clone($stateParams);
        newRouteParams.layout = layout;
        $state.go($state.current.name, mnUtil.escapeDefaultParameters(newRouteParams));
      }

      function _validateParams(params) {
        if (params.page <= 0) {
          params.page = 1;
        }
        if (params.page > ctrl.pagesCount) {
          params.page = ctrl.pagesCount;
        }
      }

      _.extend(ctrl, {
        getPage: _getPage,
        getLayout: _getLayout,
      });
    },
    function (mnBaseService, $http, $q) {
      var service = {};
      // We will activate the following later
      // mnBaseService.extendsTo(service);

      service.buffer = null;
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

      // pageIndex is 1 based!
      service.getPage = function(pageIndex) {
        // If we have the page, return the page
        if((pageIndex - 1) * service.pageSize >= service.bottomIndex
           && pageIndex * service.pageSize - 1 <= service.topIndex) {
          trace("got page " + pageIndex);
          return $q.when(service.buffer.slice(
            (pageIndex - 1) * service.pageSize - service.bottomIndex,
            pageIndex * service.pageSize - service.bottomIndex
          ));
        } else {
          return service.fetchEagerly((pageIndex - 1) * service.pageSize)
          .then(function() {
            return service.getPage(pageIndex);
          });
        }
      }

      service.fetchEagerly = function(startIndex) {
        //reset the buffer with the following command
        service.fullyLoaded = false;
        // if there is an ongoing promise, wait for it to complete after making
        // sure there will be no continuation
        if(service.thePromise != null) {
          service.beEager = false;
          return service.thePromise.then(function() {
            return service.fetchEagerly(startIndex);
          })
        } else {
          // fetch now, and then continue eagerly
          service.beEager = true;
          trace("get activities offset = " + startIndex
            + " count = " + service.firstFetchSize);
          return service.thePromise = $http.get('/api/activities?offset=' +
              startIndex + '&count=' + service.firstFetchSize)
            .then(function(resp) {
              trace("  - activities received");
              service.thePromise = null;
              service.buffer = resp.data.items;
              service.totalCount = resp.data.total_count;
              service.bottomIndex = resp.data.offset;
              service.topIndex = service.bottomIndex + resp.data.items.length;
              service.continueEagerly();
              return service.buffer;
            });
        }
      }

      service.getPageCount = function() {
        if(service.buffer) {
          var page_count = parseInt(
            (service.totalCount - 1) / service.pageSize + 1);
          trace("got page count " + page_count
            + " item count = " + service.totalCount);
          return $q.when(page_count);
        } else if(service.thePromise) {
          return service.thePromise.then(function() {
            // Somebody is already getting something, which will probably
            // do what we need, so just wait for that promise to fullfil and
            // then try again the same.
            return service.getPageCount();
          });
        } else {
          return service.getPage(1)
            .then(function() {
              return service.getPageCount();
            });
        }
      };

      Array.prototype.append = function(other_array) {
        other_array.forEach(function(v) {this.push(v)}, this);
        return this;
      }

      service.continueEagerly = function() {
        if(service.beEager) {
          if(service.bottomIndex == 0) {
            service.nextEagerGrowthForward = true;
          } else if(service.topIndex == service.totalCount - 1) {
            service.nextEagerGrowthForward = false;
          } else {
            service.nextEagerGrowthForward = !service.nextEagerGrowthForward;
          }
          // now find start and count
          var count = service.fetchSize;
          var start;
          if(service.nextEagerGrowthForward) {
            start = service.topIndex;
            if(service.totalCount - service.topIndex < count ) {
              count = service.totalCount - service.topIndex;
            }
          } else {
            start = service.bottomIndex - service.fetchSize;
            if(start < 0 ) {
              // note that start is negative, so this lowers the count
              count += start;
              start = 0;
            }
          }
          if(count==0) {
            service.fullyLoaded = true;
            return;
          }
          trace("get activities offset = " + start
            + " count = " + count);
          service.thePromise = $http.get('/api/activities?offset='
              + start + '&count=' + count)
            .then(function(resp) {
              service.thePromise = null;
              trace("  - activities received");
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
      }

      // layout getting is completelly independent
      service.layout = null;
      service.theLayoutPromise = null;
      service.getLayoutDefinitions = function() {
        if(service.layout) {
          return $q.when(service.layout);
        } else if(service.theLayoutPromise) {
          return service.theLayoutPromise.then(function() {
            service.getLayoutDefinitions();
          });
        } else {
          trace("get activities layout");
          return service.getLayoutPromise = $http.get('/api/activities/layout')
            .then(function(resp) {
              trace("  - activities layout received");
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
