(function(mohican) {
  'use strict';

  mohican.extendBasicDriver = function(ctrl, $injector, collectionName, fields) {
    mohican.extendBaseDriver(ctrl, $injector);

    ctrl.collectionName = collectionName;
    ctrl.fields = [];

    fields.forEach(function(field) {
      ctrl.fields.push(
        _.cloneDeep(field)
      );
    });
  };
}(window.mohican));
