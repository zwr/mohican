(function(mohican) {
  'use strict';

  mohican.servicesInternals = {};

  var service = mohican.servicesInternals;

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

}(window.mohican));
