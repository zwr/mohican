(function() {
  'use strict';

  angular
      .module('mohican.services')
      .factory('mnGridSelectedItemsService', [mnGridSelectedItemsService]);

  function mnGridSelectedItemsService() {
    var grids = [];

    return {
      getSelectedItems: function(gridId) {
        var selectedItems;
        for(var i = 0; i < grids.length; i++) {
          if(grids[i].id === gridId) {
            selectedItems = grids[i].selectedItems;
          }
        }
        if(angular.isUndefined(selectedItems)) {
          selectedItems = [];
          grids.push({
            id: gridId,
            selectedItems: selectedItems,
          });
        }
        return selectedItems;
      }
    };
  }

  angular
      .module('mohican.services')
      .factory('mnGridFilterService', [mnGridFilterService]);

  function mnGridFilterService() {
    var service = {
      jsonToUrlParam: function(filters, dataFields) {
        var filterObjects = [];
        for (var key in filters) {
          if (filters.hasOwnProperty(key)) {
            var field = service._getDataField(dataFields, key);
            if(field.quickfilter === 'date-range') {
              if(filters[key] instanceof Object &&
                 filters[key].startDate !== null &&
                 filters[key].endDate !== null) {
                var filterVal = filters[key].startDate.toString().split(' ').join('_') +
                                '---' +
                                filters[key].endDate.toString().split(' ').join('_');
                filterObjects.push(key + '$' + filterVal);
              }
            }
            else if(field.quickfilter === 'select') {
              if(filters[key].length > 0) {
                filterObjects.push(key + '$' + filters[key]);
              }
            }
            else {
              if(filters[key] !== '') {
                filterObjects.push(key + '$' + filters[key]);
              }
            }
          }
        }
        return filterObjects.join('$$');
      },
      urlParamToJson: function(urlParamString, dataFields) {
        var filtersObject;

        if(urlParamString && urlParamString !== '') {
          filtersObject = {};
          var urlFilters = urlParamString.split('$$');
          urlFilters.forEach(function(urlFilter) {
            var keyValue = urlFilter.split('$');
            var field = service._getDataField(dataFields, keyValue[0]);
            if(field.quickfilter === 'date-range') {
              var rangeParams = keyValue[1].split('---');
              var startDate = new Date(rangeParams[0].split('_').join(' '));
              var endDate = new Date(rangeParams[1].split('_').join(' '));
              filtersObject[keyValue[0]] = {
                startDate: startDate,
                endDate: endDate,
              };
            }
            else if(field.quickfilter === 'select') {
              var selectParams = keyValue[1].split(',');
              filtersObject[keyValue[0]] = selectParams;
            }
            else {
              filtersObject[keyValue[0]] = keyValue[1];
            }
          });
        }

        return filtersObject;
      },
      _getDataField: function(dataFields, name) {
        var field;
        dataFields.forEach(function(dField) {
          if(dField.name === name) {
            field = dField;
            return;
          }
        });
        return field;
      },
    };

    return service;
  }
})();
