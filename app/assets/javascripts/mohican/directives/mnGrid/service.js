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
})();
