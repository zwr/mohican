(function(mohican) {
  'use strict';

  mohican.mixins.dataFieldsMixin = {
    getDataField: function(dataFields, name) {
      var field;
      dataFields.forEach(function(dField) {
        if(dField.name === name) {
          field = dField;
          return;
        }
      });
      return field;
    },
    isMohicanField: function(fieldName) {
      if(_.startsWith(fieldName, '_') ||
         fieldName === 'edit' ||
         fieldName === 'commit' ||
         fieldName === 'rollback' ||
         fieldName === 'delete') {
        return true;
      }
      else {
        return false;
      }
    },
    parseFieldTypes: function(buffer, dataFields) {
      var that = this;
      buffer.forEach(function(item) {
        for(var field in item) {
          if(!that.isMohicanField(field)) {
            if(angular.isArray(item[field])) {
              item[field].forEach(function(item) {
                for(var subdocField in item) {
                  if(!that.isMohicanField(subdocField)) {
                    //TODO subdoc field types
                    var dataField = undefined;//that.getDataField(dataFields, subdocField);
                    if(dataField) {
                      that._parseField(item, dataField);
                    }
                    else {
                      that._parseField(item, {name: subdocField});
                    }
                  }
                }
              });
            }
            else {
              var dataField = that.getDataField(dataFields, field);
              if(dataField) {
                that._parseField(item, dataField);
              }
              else {
                that._parseField(item, {name: field});
              }
            }
          }
        }
      });
    },
    _parseField: function(item, field) {
      var that = this;
      if(field && field.view === 'date') {
        if(item[field.name]) {
          //do not cast if it is already Date()
          if(!(item[field.name] instanceof Date)) {
            item[field.name] = new Date(item[field.name]);
            // If the date is illegal, getTime returns NaN
            if(isNaN(item[field.name].getTime())) {
              item[field.name] = null;
              trace('Illegal date received');
            }
          }
        }
        else {
          // this is to avoid undefined and null values.
          // but this also will not allow 0, date has to be string.
          item[field.name] = null;
        }
      }
    }
  };
})(window.mohican);
