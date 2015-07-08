(function(mohican) {
  'use strict';

  mohican.createBasicDriver = function(collectionName, fields) {
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

    return basicDriver;
  };
}(window.mohican));
