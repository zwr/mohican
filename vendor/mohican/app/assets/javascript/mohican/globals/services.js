(function(mohican) {
  'use strict';

  mohican.constructBaseService = function(apiResource, $injector) {
    var service = {};
    var $q = $injector.get('$q');
    var $http = $injector.get('$http');
    var mnNotify = $injector.get('mnNotify');
    _.assign(service, mohican.mixins.dataFieldsMixin);
    _.assign(service, mohican.mixins.crudMixin);
    service.mnNotify = mnNotify;
    mohican.extendBaseService(service, apiResource, $http, $q);
    return service;
  };

  mohican.extendBaseService = function(service, apiResource, $http, $q) {
    service.resetLoading = function() {
      service.buffer = null;
      service.loadingBuffer = null;
      service.bufferSnapshotActive = false;
      service.bufferBackendFilter = null;
      service.openfilters = null;
      service.bufferView = null;

      // Following is the bottom and top index of the buffer data. At some point,
      // when it is completelly loaded, these two will be 0 and totalCount.
      service.bottomIndex = undefined;
      service.topIndex = undefined;
      service.loadingBufferBottomIndex = undefined;
      service.loadingBufferTopIndex = undefined;
      service.totalCount = undefined;
      // Following is set to true when eager loading starts. Setting this to false
      // interupts eager loading, so that we can start it all over again. See
      // where it is set to false to understand why we would do it.
      service.beEager = false;

      // Following becomes true when all the filter records have been retrieved
      // if somebody was waiting on this promise, we need to disapoint them
      if(service._fullyLoadedPromise) {
        service._fullyLoadedPromise.reject();
      }
      service._fullyLoadedPromise = null;

      if(service._snapshotLoadedPromise) {
        service._snapshotLoadedPromise.reject();
      }
      service._snapshotLoadedPromise = null;
    };

    service.resetLoading();

    // Following is the ongoing promise. This is the only promise that can
    // run against the server. If this is already take (not null), we need to
    // wait for it to fulfill and only .then set our own promise.
    service.thePromise = null;

    service.bufferMax = 1000;

    // Following is used to calculate the actual index of the required element
    service.pageSize = 20;
    // Following points out in which direction to grow the buffer. First it will
    // actually move forward, as this flag is flipped before the http request
    // is sent.
    service.nextEagerGrowthForward = false;
    // Following constant shows the size of fetch. It must by all means be
    // larger than pageSize
    service.fetchSize = 200;
    service.firstFetchSize = 200;

    service.waitFullyLoaded = function() {
      return service._fullyLoadedPromise.promise;
    };

    service.waitSnapshotLoaded = function() {
      return service._snapshotLoadedPromise.promise;
    };

    service.getClientPage = function(pageNumber, column, direction, filters, dataFields) {
      service.bufferView = service._filter(service.buffer, filters, dataFields);
      service.bufferView = service._sort(service.bufferView, column, direction === 'asc' ? true : false, dataFields);

      var viewpageCount = parseInt(
        (service.bufferView.length - 1) / service.pageSize + 1);

      var res = $q.when({
        items: service.bufferView.slice(
          (pageNumber - 1) * service.pageSize - service.bottomIndex,
          pageNumber * service.pageSize - service.bottomIndex
        ),
        pageCount:    viewpageCount,
        totalQfCount: service.bufferView.length
      });
      service.bufferView = null;
      return res;
    };

    // pageNumber is 1 based!
    service.getBackendPage = function(pageNumber, dataFields, documentFilter, openfilters) {
      if(service.bufferBackendFilter !== documentFilter ||
         service.openfilters !== openfilters) {
        service.resetLoading();
        service.bufferBackendFilter = documentFilter;
        service.openfilters = openfilters;
      }

      // If we have the page, return the page
      if((pageNumber - 1) * service.pageSize >= service.bottomIndex
         && (pageNumber * service.pageSize <= service.topIndex)
               || (service.topIndex === service.totalCount
                    && (pageNumber + 1) * service.pageSize - 1 > service.totalCount)) {
        return $q.when(service.buffer.slice(
          (pageNumber - 1) * service.pageSize - service.bottomIndex,
          pageNumber * service.pageSize - service.bottomIndex
        ));
      } else {
        if(service.thePromise) {
          return service.thePromise.then(function() {
            return service.getBackendPage(pageNumber, dataFields, documentFilter, openfilters);
          });
        } else {
          // Here we start the new eager loading
          service._fullyLoadedPromise = $q.defer();
          service._snapshotLoadedPromise = $q.defer();
          return service.fetchEagerly((pageNumber - 1) * service.pageSize, dataFields, documentFilter, openfilters)
          .then(function() {
            return service.getBackendPage(pageNumber, dataFields, documentFilter, openfilters);
          });
        }
      }
    };

    service.getCurrentBufferSnapshot = function() {
      service.bufferSnapshotActive = true;
      service.loadingBuffer = _.clone(service.buffer);
      service.loadingBufferBottomIndex = service.bottomIndex;
      service.loadingBufferTopIndex = service.topIndex;
      service._snapshotLoadedPromise.notify();
      return service.buffer;
    };

    service.refreshCurrentBufferSnapshot = function() {
      service.bufferSnapshotActive = true;
      service.buffer = _.clone(service.loadingBuffer);
      service.bottomIndex = service.loadingBufferBottomIndex;
      service.topIndex = service.loadingBufferTopIndex;
      service._snapshotLoadedPromise.notify();
      return service.buffer;
    };

    service.fetchEagerly = function(startIndex, dataFields, documentFilter, openfilters) {
      //reset the buffer with the following command
      //service.fullyLoaded = false;
      // if there is an ongoing promise, wait for it to complete after making
      // sure there will be no continuation
      if(service.thePromise != null) {
        service.beEager = false;
        return service.thePromise.then(function() {
          return service.fetchEagerly(startIndex, dataFields, documentFilter, openfilters);
        });
      } else {
        // fetch now, and then continue eagerly
        service.beEager = true;
        trace('get  offset = ' + startIndex
          + ' count = ' + service.firstFetchSize);
        service.thePromise = $http.get(window.MN_BASE + '/' + apiResource + '?offset=' +
            startIndex + '&count=' + service.firstFetchSize + '&filter=' + documentFilter +
            '&openfilters=' + openfilters)
          .then(function(resp) {
            service.thePromise = null;
            if(service.bufferBackendFilter === documentFilter ||
               service.openfilters !== openfilters) {
              service.prepareDocumentsCrudOperations(resp.data.items, dataFields, $http, $q, apiResource, service.layout);
              service.buffer = resp.data.items;
              service.backendTotalCount = resp.data.total_count;
              service.totalCount = resp.data.total_count > service.bufferMax ? service.bufferMax : resp.data.total_count;
              service.bottomIndex = resp.data.offset;
              // topIndex is not the index of top document, but one beyond!
              service.topIndex = service.bottomIndex + resp.data.items.length;
              service._continueEagerly(dataFields, documentFilter, openfilters);
              return service.buffer;
            } else {
              /* loading has been restarted, possibly backend filter changed */
              return null;
            }
          })
          .catch(function(errorCode) {
            console.log('error fetchEagerly');
            var warn = service.mnNotify.reportConnectivityProblem(errorCode.status);
            console.log(warn);
            warn.promise.then(function() {
              console.log('fetchEagerly');
              warn.clearReportConnectivityProblem();
              service.thePromise = service.fetchEagerly(startIndex, dataFields, documentFilter, openfilters);
            });
          });
        return service.thePromise;
      }
    };

    service._continueEagerly = function(dataFields, documentFilter, openfilters) {
      var topIndexVariable = 'topIndex';
      var bottomIndexVariable = 'bottomIndex';
      if(service.bufferSnapshotActive) {
        topIndexVariable = 'loadingBufferTopIndex';
        bottomIndexVariable = 'loadingBufferBottomIndex';
      }

      if(service.beEager) {
        if(service[bottomIndexVariable] === 0) {
          service.nextEagerGrowthForward = true;
          if(service[topIndexVariable] === service.totalCount) {
            service._completeFullLoading();
            return;
          }
        } else if(service[topIndexVariable] === service.totalCount) {
          service.nextEagerGrowthForward = false;
        } else {
          service.nextEagerGrowthForward = !service.nextEagerGrowthForward;
        }
        // now find start and count
        var count = service.fetchSize;
        var start;
        if(service.nextEagerGrowthForward) {
          start = service[topIndexVariable];
          if(service.totalCount - service[topIndexVariable] < count) {
            count = service.totalCount - service[topIndexVariable];
          }
        } else {
          start = service[bottomIndexVariable] - service.fetchSize;
          if(start < 0) {
            // note that start is negative, so this lowers the count
            count += start;
            start = 0;
          }
        }
        if(count === 0) {
          service._completeFullLoading();
          return;
        }
        trace('get  offset = ' + start
          + ' count = ' + count);
        service.thePromise = $http.get(window.MN_BASE + '/' + apiResource + '?offset='
            + start + '&count=' + count + '&filter=' + documentFilter +
            '&openfilters=' + openfilters)
          .then(function(resp) {
            service._fullyLoadedPromise.notify(resp.data.items);
            service.thePromise = null;
            // if we were told to stop, just do nothing
            if(service.beEager) {
              service.prepareDocumentsCrudOperations(resp.data.items, dataFields, $http, $q, apiResource, service.layout);
              if(service.nextEagerGrowthForward) {
                if(service.bufferSnapshotActive) {
                  service.loadingBufferTopIndex += resp.data.items.length;
                  service.loadingBuffer.append(resp.data.items);
                }
                else {
                  service.topIndex += resp.data.items.length;
                  service.buffer.append(resp.data.items);
                }
              } else {
                if(service.bufferSnapshotActive) {
                  service.loadingBuffer = resp.data.items.append(service.buffer);
                  service.loadingBufferBottomIndex -= resp.data.items.length;
                }
                else {
                  service.bottomIndex -= resp.data.items.length;
                  service.buffer = resp.data.items.append(service.buffer);
                }
              }
              service._continueEagerly(dataFields, documentFilter, openfilters);
            }
          })
          .catch(function(errorCode) {
            var warn = service.mnNotify.reportConnectivityProblem(errorCode.status);
            warn.promise.then(function() {
              service.mnNotify.clearReportConnectivityProblem();
              service.thePromise = service._continueEagerly(dataFields, documentFilter, openfilters);
            });
          });
      }
    };

    service.getBackendPageCount = function(dataFields, tip, documentFilter, openfilters) {
      if(service.bufferBackendFilter !== documentFilter ||
         service.openfilters !== openfilters) {
        service.resetLoading();
      }
      if(service.buffer) {
        var pageCount = parseInt(
          (service.totalCount - 1) / service.pageSize + 1);
        return $q.when(pageCount);
      } else if(service.thePromise) {
        return service.thePromise.then(function() {
          // Somebody is already getting something, which will probably
          // do what we need, so just wait for that promise to fullfil and
          // then try again the same.
          return service.getBackendPageCount(dataFields, tip, documentFilter, openfilters);
        });
      } else {
        return service.getBackendPage(tip || 1, dataFields, documentFilter, openfilters)
          .then(function() {
            return service.getBackendPageCount(dataFields, tip, documentFilter, openfilters);
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
        service.theLayoutPromise = $http.get(window.MN_BASE + '/' + apiResource + '/layout')
          .then(function(resp) {
            service.theLayoutPromise = null;
            service.layout = resp.data.layout;
            return service.layout;
          });
        return service.theLayoutPromise;
      }
    };

    // documentFilters getting is completelly independent
    service.documentFilters = null;
    service.getBackendFilterPromise = null;
    service.getBackendFilters = function() {
      if(service.documentFilters) {
        return $q.when(service.documentFilters);
      } else if(service.getBackendFilterPromise) {
        return service.getBackendFilterPromise.then(function() {
          service.getBackendFilters();
        });
      } else {
        trace('get  documentFilters');

        var mockHttp = $q.defer();
        service.getBackendFilterPromise = mockHttp.promise;

        service.documentFilters = [{name: 'default'}, {name: 'first'}, {name: 'second'}];
        mockHttp.resolve(service.documentFilters);

        return service.getBackendFilterPromise;
      }
    };

    service.getDocument = function(id, dataFields) {
      var foundDocument = service.findBy(service.layout.primaryKeyName, id);
      if(foundDocument) {
        return $q.when(foundDocument);
      } else {
        // This is the complicated part. If the document is already there,
        // fine, we return it. But if it is not, we reset whatever is
        // loading/loaded!
        // Following is here to stop any ongoing eager loading
        // We use some unique but ad-hoc 'back end filter'
        // because it is a back end filter
        // The logic behind this code is the following:
        //     service.bufferBackendFilter  shows us what is currently in
        //     the buffer, and this id IS what will be there, so we write
        //     that if we are about to put it there.
        if(service.bufferBackendFilter !== 'single-id-' + id) {
          service.resetLoading();
          service.bufferBackendFilter = 'single-id-' + id;
        }

        // Following is pretty much copy-pasted from the getPage logic, but
        // sine we are loading only one document, there is not eager loading call.
        if(service.thePromise) {
          return service.thePromise.then(function() {
            return service.getDocument(id);
          });
        } else {
          service.thePromise = $http.get(window.MN_BASE + '/' + apiResource +
            '/' + id)
          .then(function(resp) {
            service.thePromise = null;
            if(service.bufferBackendFilter === 'single-id-' + id) {
              //because of convention, we are returning array of items
              //even if this is single document
              var item2items = [];
              if(resp.data) {
                item2items.push(resp.data);
              }
              // check if it is really resp.data or something similar
              service.prepareDocumentsCrudOperations(item2items, dataFields, $http, $q, apiResource, service.layout);
              service.buffer = item2items;
              // now write this data honestly, as it is: back end count is
              // 1, because we only fetched one document, and there is no
              // offset, as that would make no sense.
              service.totalCount = 1;
              service.bottomIndex = 0;
              service.topIndex = 0;
              // Note that this is returning an array, to be consistent with
              // all other document getters!
              return service.buffer;
            } else {
              return null;
            }
          }, function(error) {
            throw(error);
          });
          return service.thePromise;
        }
      }
    };

    service.findBy = function(key, value) {
      if(!service.buffer) {
        return undefined;
      }
      return service.buffer.filter(function(item) {
        return item[key] == value;
      });
    };

    service._sort = function(collection, prop, asc, dataFields) {
      var timeStart = Date.now();
      var dataField = service.getDataField(dataFields, prop);

      if(dataField) {
        collection = _.sortBy(collection, function (obj) {
          return obj[prop];
        });
        collection = asc ? collection : collection.reverse();
      }
      trace('Sorting done ms: ' + (Date.now() - timeStart));
      return collection;
    };

    service._filter = function(collection, filters, dataFields) {
      collection = collection.filter(function(item) {
        var filtered = true;
        for (var key in filters) {
          var filter = filters[key];
          var value = item[key];
          if(angular.isDefined(filter)) {
            if(angular.isUndefined(value)) {
              filtered = false;
              break;
            }
            var dataField = service.getDataField(dataFields, key);
            if(dataField && dataField.quickfilter === 'date-range') {
              var dateValue = moment(value);
              filtered = filtered && (dateValue >= filter.startDate && dateValue <= filter.endDate);
            }
            else if(dataField && dataField.quickfilter === 'select') {
              if(filter.length === 0) {
                filtered = filtered && true;
              }
              else {
                filtered = filtered && _.contains(filter, value);
              }
            }
            else {
              filtered = filtered &&
                            (value.toString().toLowerCase().
                                   indexOf(filter.toString().toLowerCase()) !== -1);
            }
            if(!filtered) {
              break;
            }
          }
        }
        return filtered;
      });
      return collection;
    };

    /* eslint-disable no-extend-native */
    Array.prototype.append = function(otherArray) {
      otherArray.forEach(function(v) { this.push(v); }, this);
      return this;
    };
    /* eslint-enable no-extend-native */

    service._completeFullLoading = function() {
      service._fullyLoadedPromise.resolve();
      service.nextCloned = 1;
      trace('data are fully loaded');
    };

    service.preloadAllData = function() {
      var deffered = $q.defer();
      var notif = service.mnNotify.info({
        message: apiResource + ' eager data loading...',
        details: 'You will be able to see all data after eager loading finish',

        dismissable: false
      });
      service.getPreviewDefinitions().
              then(function(definition) {
                var dataFields = [];
                definition.layouts.forEach(function(layout) {
                  if(layout.name === 'default') {
                    dataFields = layout.definition;
                  }
                });
                return dataFields;
              }).
              then(function(dataFields) {
                service.getBackendPageCount(dataFields, 1, 'default').then(function(pageCount) {
                  service.getBackendPage(1, dataFields, 'default').
                  then(function() {
                    service.waitFullyLoaded().then(function() {
                      notif.message.dismiss();
                      service.mnNotify.success({
                        message: apiResource + ' eager data has been loaded',
                        delay:   -1
                      });
                      deffered.resolve();
                    });
                  });
                });
              });
      return deffered.promise;
    };

    return service;
  };
}(window.mohican));
