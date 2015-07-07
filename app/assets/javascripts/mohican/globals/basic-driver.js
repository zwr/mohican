(function(mohican) {
  'use strict';

  mohican.metaData = {
    defaultFields: {
      handlers: [
        {
          header: 'Name',
          name:   'name',
          view:   'text',
          width:  150
        },
        {
          header: 'Address',
          name:   'address',
          view:   'text',
          width:  200
        },
        {
          header: 'Post Number',
          name:   'postno',
          view:   'text',
          width:  100
        },
        {
          header: 'City',
          name:   'city',
          view:   'text',
          width:  100
        }
      ],
      products: [
        {
          header: 'EAN',
          name:   'ean',
          view:   'text',
          width:  150
        },
        {
          header: 'Name',
          name:   'name',
          view:   'text',
          width:  600
        }
      ]
    }
  };

  mohican.createBasicDriver = function(ctrl, collectionName, mnRouter) {
    var basicDriver = ctrl['CurrentItem' + _.capitalize(collectionName) + 'Controller'] = {};
    _.assign(basicDriver, mohican.createBaseDriver());

    basicDriver.collectionName = collectionName;
    basicDriver.fields = [];
    basicDriver.$state = mnRouter.$state;
    basicDriver.$stateParams = mnRouter.$stateParams;
    mohican.redirectDefaultParameters(basicDriver.$stateParams, basicDriver.$state);
    mohican.injectDefaultParameters(basicDriver.$stateParams);
    basicDriver.stateMachine.stateMachineFromUrl(basicDriver.$stateParams);

    mohican.metaData.defaultFields[collectionName].forEach(function(field) {
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
  };
}(window.mohican));
