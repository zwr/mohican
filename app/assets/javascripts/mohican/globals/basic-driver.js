(function(mohican) {
  'use strict';

  mohican.createBasicDriver = function(ctrl, collectionName, fields) {
    var basicDriver = {};
    _.assign(basicDriver, mohican.createBaseDriver());

    basicDriver.collectionName = collectionName;
    basicDriver.fields = [];

    fields.forEach(function(field) {
      basicDriver.fields.push(
        {
          header:      field.header,
          name:        field.name,
          quickfilter: null,
          quicksort:   false,
          view:        field.view,
          width:       field.width
        }
      );
    });

    ctrl.onCurrentItemChanged.push(function(newCurrentItem) {
      basicDriver.items = [];
      if(newCurrentItem[basicDriver.collectionName]) {
        basicDriver.items = newCurrentItem[basicDriver.collectionName];
        basicDriver.items.forEach(function(item) {
          for(var key in item) {
            item[key + '_formatted'] = item[key];
          }
        });
      }
    });

    return basicDriver;
  };
}(window.mohican));
