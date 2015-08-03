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
            var dataField = that.getDataField(dataFields, field);
            if(dataField) {
              that._parseField(item, dataField);
            }
            else {
              that._parseField(item, {name: field});
            }
          }
        }
      });
    },
    _setFormattedDateField: function(item, field) {
      item['_' + field.name + '_formatted'] = (item[field.name] ? moment(item[field.name]).format(field.format) : '');
    },
    _setFormattedNumberField: function(item, field) {
      var decimalParams = field.view.slice(7, field.view.length - 1);
      item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name].toFixed(decimalParams) : '');
    },
    _setFormattedTextField: function(item, field) {
      item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name] : '');
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
        field.format = 'DD.MM.YYYY.';//TODO: store format information in db
        that._setFormattedDateField(item, field);
      }
      else if(field && (_.startsWith(field.view, 'number'))) {
        that._setFormattedNumberField(item, field);
      }
      else if(field && field.view === 'text') {
        that._setFormattedTextField(item, field);
      }
      else {
        //just copy content
        item['_' + field.name + '_formatted'] = (item[field.name] ? item[field.name] : '');
      }
    }
  };
})(window.mohican);
