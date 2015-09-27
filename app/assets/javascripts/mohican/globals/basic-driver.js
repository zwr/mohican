(function(mohican) {
  'use strict';

  mohican.extendBasicDriver = function(ctrl, $injector, collectionName, fields) {
    _.assign(ctrl, mohican.createBaseDriver($injector));

    ctrl.collectionName = collectionName;
    ctrl.fields = [];

    fields.forEach(function(field) {
      ctrl.fields.push(
        _.cloneDeep(field)
      );
    });
  };
}(window.mohican));
