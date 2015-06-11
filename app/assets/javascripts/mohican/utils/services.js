(function(mohican) {
  'use strict';

  mohican.extendBaseService = function(service, docname, $http, $q) {
    service.resetLoading = function() {
      service.buffer = null;
      service.bufferBackendFilter = null;
      service.bufferView = null;

      // Following is the bottom and top index of the buffer data. At some point,
      // when it is completelly loaded, these two will be 0 and totalCount.
      service.bottomIndex = undefined;
      service.topIndex = undefined;
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
    };

    service.resetLoading();

    // Following is the ongoing promise. This is the only promise that can
    // run against the server. If this is already take (not null), we need to
    // wait for it to fulfill and only .then set our own promise.
    service.thePromise = null;

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

    service.waitFullyLoaded = function() {
      return service._fullyLoadedPromise.promise;
    };

    service._getDataField = function(dataFields, name) {
      var field;
      dataFields.forEach(function(dField) {
        if(dField.name === name) {
          field = dField;
          return;
        }
      });
      return field;
    };

    service._sort = function(collection, prop, asc, dataFields) {
      var timeStart = Date.now();
      var dataField = service._getDataField(dataFields, prop);

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
            var dataField = service._getDataField(dataFields, key);
            if(dataField && dataField.quickfilter === 'date-range') {
              filtered = filtered && (value >= filter.startDate && value <= filter.endDate);
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

    service._parseFieldTypes = function(buffer, dataFields) {
      buffer.forEach(function(item) {
        dataFields.forEach(function(field) {
          if(field.view === 'date') {
            if(item[field.name]) {
              //do not cast if it is already Date()
              if(!(item[field.name] instanceof Date)) {
                item[field.name] = new Date(item[field.name]);
                // If the date is illegal, getTime returns NaN
                if(isNaN(item[field.name].getTime())) {
                  item[field.name] = null;
                  trace('Illegal date received');
                }
              }
            }
            else {
              // this is to avoid undefined and null values.
              // but this also will not allow 0, date has to be string.
              item[field.name] = null;
            }
            field.format = 'DD.MM.YYYY.';//TODO: store format information in db
            item[field.name + '_formatted'] = (item[field.name] ? moment(item[field.name]).format(field.format) : '');
          }
          else if((_.startsWith(field.view, 'number'))) {
            var decimalParams = field.view.slice(7, field.view.length - 1);
            item[field.name + '_formatted'] = (angular.isDefined(item[field.name]) ? item[field.name].toFixed(decimalParams) : '');
          }
          else {
            item[field.name + '_formatted'] = (angular.isDefined(item[field.name]) ? item[field.name] : '');
          }
        });
      });
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
        pageCount: viewpageCount,
      });
      service.bufferView = null;
      return res;
    };

    // pageNumber is 1 based!
    service.getBackendPage = function(pageNumber, dataFields, backendFilter) {
      if(service.bufferBackendFilter !== backendFilter) {
        service.resetLoading();
        service.bufferBackendFilter = backendFilter;
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
        if(this.thePromise) {
          return this.thePromise.then(function() {
            return service.getBackendPage(pageNumber, dataFields, backendFilter);
          });
        } else {
          // Here we start the new eager loading
          service._fullyLoadedPromise = $q.defer();
          return service.fetchEagerly((pageNumber - 1) * service.pageSize, dataFields, backendFilter)
          .then(function() {
            return service.getBackendPage(pageNumber, dataFields, backendFilter);
          });
        }
      }
    };

    service.fetchEagerly = function(startIndex, dataFields, backendFilter) {
      //reset the buffer with the following command
      //service.fullyLoaded = false;
      // if there is an ongoing promise, wait for it to complete after making
      // sure there will be no continuation
      if(service.thePromise != null) {
        service.beEager = false;
        return service.thePromise.then(function() {
          return service.fetchEagerly(startIndex, dataFields, backendFilter);
        });
      } else {
        // fetch now, and then continue eagerly
        service.beEager = true;
        trace('get  offset = ' + startIndex
          + ' count = ' + service.firstFetchSize);
        service.thePromise = $http.get(window.MN_BASE + '/' + docname + '?offset=' +
            startIndex + '&count=' + service.firstFetchSize + '&filter=' + backendFilter)
          .then(function(resp) {
            service.thePromise = null;
            if(service.bufferBackendFilter === backendFilter) {
              service.buffer = resp.data.items;
              service._parseFieldTypes(service.buffer, dataFields);
              service.totalCount = resp.data.total_count;
              service.bottomIndex = resp.data.offset;
              // topIndex is not the index of top document, but one beyond!
              service.topIndex = service.bottomIndex + resp.data.items.length;
              service._continueEagerly(dataFields, backendFilter);
              return service.buffer;
            } else {
              /* loading has been restarted, possibly backend filter changed */
              return null;
            }
          });
        return service.thePromise;
      }
    };

    service.getBackendPageCount = function(dataFields, tip, backendFilter) {
      if(service.bufferBackendFilter !== backendFilter) {
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
          return service.getBackendPageCount(dataFields, tip, backendFilter);
        });
      } else {
        return service.getBackendPage(tip || 1, dataFields, backendFilter)
          .then(function() {
            return service.getBackendPageCount(dataFields, tip, backendFilter);
          });
      }
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

    service._continueEagerly = function(dataFields, backendFilter) {
      if(service.beEager) {
        if(service.bottomIndex === 0) {
          service.nextEagerGrowthForward = true;
          if(service.topIndex === service.totalCount) {
            service._completeFullLoading();
            return;
          }
        } else if(service.topIndex === service.totalCount) {
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
          service._completeFullLoading();
          return;
        }
        trace('get  offset = ' + start
          + ' count = ' + count);
        service.thePromise = $http.get(window.MN_BASE + '/' + docname + '?offset='
            + start + '&count=' + count + '&filter=' + backendFilter)
          .then(function(resp) {
            service.thePromise = null;
            // if we were told to stop, just do nothing
            if(service.beEager) {
              if(service.nextEagerGrowthForward) {
                service.topIndex += resp.data.items.length;
                service.buffer.append(resp.data.items);
                service._parseFieldTypes(service.buffer, dataFields);
              } else {
                service.bottomIndex -= resp.data.items.length;
                service.buffer = resp.data.items.append(service.buffer);
                service._parseFieldTypes(service.buffer, dataFields);
              }
              service._continueEagerly(dataFields, backendFilter);
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
        service.getLayoutPromise = $http.get(window.MN_BASE + '/' + docname + '/layout')
          .then(function(resp) {
            service.getLayoutPromise = null;
            service.layout = resp.data.layout;
            return service.layout;
          });
        return service.getLayoutPromise;
      }
    };

    // backendFilters getting is completelly independent
    service.backendFilters = null;
    service.theBackendFiltersPromise = null;
    service.getBackendFilters = function() {
      if(service.backendFilters) {
        return $q.when(service.backendFilters);
      } else if(service.theBackendFiltersPromise) {
        return service.theBackendFiltersPromise.then(function() {
          service.getBackendFilters();
        });
      } else {
        trace('get  backendFilters');

        var mockHttp = $q.defer();
        service.getBackendFilterPromise = mockHttp.promise;

        service.backendFilters = [{name: 'default'}, {name: 'first'}, {name: 'second'}];
        mockHttp.resolve(service.backendFilters);

        return service.getBackendFilterPromise;
      }
    };

    return service;
  };
}(window.mohican));
