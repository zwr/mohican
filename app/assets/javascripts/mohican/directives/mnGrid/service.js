(function() {
  'use strict';

  angular
      .module('mohican.services')
      .factory('mnGridFilterService', [mnGridFilterService]);

  function mnGridFilterService() {
    var service = {
      jsonToUrlParam: function(filters) {
        var filterObjects = [];
        for (var key in filters) {
          if (filters.hasOwnProperty(key) && filters[key] !== '') {
            filterObjects.push(key + '$' + filters[key]);
          }
        }
        return filterObjects.join('$$');
      },
      urlParamToJson: function(urlParamString) {
        var filtersObject = {};

        if(urlParamString && urlParamString !== '') {
          var urlFilters = urlParamString.split('$$');
          urlFilters.forEach(function(urlFilter) {
            var keyValue = urlFilter.split('$');
            filtersObject[keyValue[0]] = keyValue[1];
          });
        }

        return filtersObject;
      },
    };

    return service;
  }
})();
