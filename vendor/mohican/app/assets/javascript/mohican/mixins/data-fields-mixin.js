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
    }
  };
})(window.mohican);
