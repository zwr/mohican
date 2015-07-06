(function(mohican) {
  'use strict';

  mohican.extendBasicDriver = function(ctrl, collectionName, fields) {
    _.assign(ctrl, mohican.createBaseDriver());
    _.assign(ctrl, mohican.createBasicDriver());
    ctrl.collectionName = collectionName;
    ctrl.fields = [];
    fields.forEach(function(field) {
      ctrl.fields.push(
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

    return function(newCurrentItem) {
      console.log(newCurrentItem);
      ctrl.items = [];
      if(newCurrentItem[ctrl.collectionName]) {
        ctrl.items = newCurrentItem[ctrl.collectionName];
        ctrl.items.forEach(function(item) {
          for(var key in item) {
            item[key + '_formatted'] = item[key];
          }
        });
      }
    };
  };

  mohican.createBasicDriver = function() {
    return {

    };
  };
}(window.mohican));
