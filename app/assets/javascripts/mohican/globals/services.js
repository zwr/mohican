(function(mohican) {
  'use strict';

  mohican.constructBaseService = function(apiResource, $http, $q) {
    var service = {};
    mohican.extendBaseService(service, apiResource, $http, $q);
    return service;
  };

  mohican.extendBaseService = function(service, apiResource, $http, $q) {
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
        if(service.thePromise) {
          return service.thePromise.then(function() {
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
        service.thePromise = $http.get(window.MN_BASE + '/' + apiResource + '?offset=' +
            startIndex + '&count=' + service.firstFetchSize + '&filter=' + backendFilter)
          .then(function(resp) {
            service.thePromise = null;
            if(service.bufferBackendFilter === backendFilter) {
              service._prepareDocumentsCrudOperations(resp.data.items, dataFields);
              service._parseFieldTypes(resp.data.items, dataFields);
              service.buffer = resp.data.items;
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
        service.thePromise = $http.get(window.MN_BASE + '/' + apiResource + '?offset='
            + start + '&count=' + count + '&filter=' + backendFilter)
          .then(function(resp) {
            service.thePromise = null;
            // if we were told to stop, just do nothing
            if(service.beEager) {
              service._prepareDocumentsCrudOperations(resp.data.items, dataFields);
              service._parseFieldTypes(resp.data.items, dataFields);
              if(service.nextEagerGrowthForward) {
                service.topIndex += resp.data.items.length;
                service.buffer.append(resp.data.items);
              } else {
                service.bottomIndex -= resp.data.items.length;
                service.buffer = resp.data.items.append(service.buffer);
              }
              service._continueEagerly(dataFields, backendFilter);
            }
          });
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

    // backendFilters getting is completelly independent
    service.backendFilters = null;
    service.getBackendFilterPromise = null;
    service.getBackendFilters = function() {
      if(service.backendFilters) {
        return $q.when(service.backendFilters);
      } else if(service.getBackendFilterPromise) {
        return service.getBackendFilterPromise.then(function() {
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
              service._prepareDocumentsCrudOperations(item2items, dataFields);
              service._parseFieldTypes(item2items, dataFields);
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

    service._setFormattedDateField = function(item, field) {
      item['_' + field.name + '_formatted'] = (item[field.name] ? moment(item[field.name]).format(field.format) : '');
    };
    service._setFormattedNumberField = function(item, field) {
      var decimalParams = field.view.slice(7, field.view.length - 1);
      item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name].toFixed(decimalParams) : '');
    };
    service._setFormattedTextField = function(item, field) {
      item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name] : '');
    };
    service._parseField = function(item, field) {
      if(field && field.view === 'date') {
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
        service._setFormattedDateField(item, field);
      }
      else if(field && (_.startsWith(field.view, 'number'))) {
        service._setFormattedNumberField(item, field);
      }
      else if(field && field.view === 'text') {
        service._setFormattedTextField(item, field);
      }
      else {
        //just copy content
        item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name] : '');
      }
    };
    service._parseFieldTypes = function(buffer, dataFields) {
      buffer.forEach(function(item) {
        for(var field in item) {
          if(!service._isMohicanField(field)) {
            var dataField = service._getDataField(dataFields, field);
            if(dataField) {
              service._parseField(item, dataField);
            }
            else {
              service._parseField(item, {name: field});
            }
          }
        }
      });
    };

    service.theCommitPromise = null;
    service.theDeletePromise = null;
    service._prepareDocumentsCrudOperations = function(buffer, dataFields) {
      buffer.forEach(function(item) {
        item._state = 'ready';
        //initial create _changed fields on every item
        for(var field in item) {
          item['_' + field + '_changed'] = false;
        }
        item.edit = function() {
          this._state = 'editing';
          this._edit = _.cloneDeep(this);
        };

        item.commit = function() {
          item._state = 'committing';
          if(service.theCommitPromise) {
            return service.theCommitPromise.then(function() {
              item.commit();
            });
          } else {
            var data = {};
            data[service.layout.doctype] = item._getDiffs();
            service.theCommitPromise = $http.put(window.MN_BASE + '/' + apiResource + '/' + item[service.layout.primaryKeyName] + '.json', data)
              .then(function(resp) {
                service.theCommitPromise = null;
                for(var field in item) {
                  if(_.endsWith(field, '_changed')) {
                    item[field] = false;
                  }
                  else if(_.endsWith(field, '_formatted')) {
                    //do noting
                  }
                  else {
                    item[field] = item._edit[field];
                    var dataField = service._getDataField(dataFields, field);
                    if(dataField) {
                      service._parseField(item, dataField);
                    }
                    else {
                      service._parseField(item, {name: field});
                    }
                  }
                }
                item._state = 'ready';
              });
            return service.theCommitPromise;
          }
        };
        item.rollback = function() {
          delete this._edit;
          this._state = 'ready';
          for(var field in item) {
            if(_.endsWith(field, '_changed')) {
              item[field] = false;
            }
          }
        };
        item.delete = function() {
          item._state = 'deleting';
          if(service.theDeletePromise) {
            return service.theDeletePromise.then(function() {
              item.delete();
            });
          } else {
            var data = {};
            data[service.layout.doctype] = item._edit;
            service.theDeletePromise = $http.delete(window.MN_BASE + '/' + apiResource + '/' + item[service.layout.primaryKeyName] + '.json', data)
              .then(function(resp) {
                service.theDeletePromise = null;
                for(var field in item) {
                  if(_.endsWith(field, '_changed')) {
                    item[field] = false;
                  }
                }
                item._state = 'deleted';
                var index = buffer.indexOf(item);
                if(index !== -1) {
                  buffer.splice(index, 1);
                }
                service.totalCount--;
              });
            return service.theDeletePromise;
          }
        };

        item._getDiffs = function() {
          var diffObject = {};
          for(var field in item) {
            if(!service._isMohicanField(field) &&
               item['_' + field + '_changed']) {
              diffObject[field] = item._edit[field];
            }
          }
          return diffObject;
        };
      });
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

    service._isMohicanField = function(fieldName) {
      if(_.startsWith(fieldName, '_') ||
         fieldName === 'edit' ||
         fieldName === 'commit' ||
         fieldName === 'rollback' ||
         fieldName === 'delete') {
        return true;
      }
      else {
        return false;
      }
    };

    return service;
  };
}(window.mohican));
