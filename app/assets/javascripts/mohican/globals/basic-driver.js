(function(mohican) {
  'use strict';

  mohican.createBasicDriver = function($injector, collectionName, fields) {
    var basicDriver = {};
    _.assign(basicDriver, mohican.createBaseDriver($injector));

    basicDriver.collectionName = collectionName;
    basicDriver.fields = [];

    fields.forEach(function(field) {
      basicDriver.fields.push(
        _.cloneDeep(field)
      );
    });

    return basicDriver;
  };
}(window.mohican));
