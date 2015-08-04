(function(mohican) {
  'use strict';

  mohican.mixins.crudMixin = {};

  _.assign(mohican.mixins.crudMixin, mohican.mixins.dataFieldsMixin);

  mohican.mixins.crudMixin.theCommitPromise = null;
  mohican.mixins.crudMixin.theDeletePromise = null;

  mohican.mixins.crudMixin.prepareDocumentsCrudOperations = function(buffer, dataFields, $http, apiResource, layout) {
    var isArray = function(obj) { return Object.prototype.toString.call(obj) === '[object Array]'; };
    var that = this;
    buffer.forEach(function(item) {
      item._state = 'ready';
      //initial create _changed fields on every item
      for(var ifield in item) {
        if(!that.isMohicanField(ifield)) {
          item['_' + ifield + '_changed'] = false;
          if(isArray(item[ifield])) {
            that.prepareSubDocumentsCrudOperations(item, ifield, []);
          }
        }
      }
      item.edit = function() {
        item._state = 'editing';
        item._edit = _.cloneDeep(item);
      };

      item.commit = function() {
        item._state = 'committing';
        if(that.theCommitPromise) {
          return that.theCommitPromise.then(function() {
            item.commit();
          });
        } else {
          var data = {};
          data[layout.doctype] = item._getDiffs();
          that.theCommitPromise = $http.put(window.MN_BASE + '/' + apiResource + '/' + item[layout.primaryKeyName] + '.json', data)
            .then(function() {
              that.theCommitPromise = null;
              for(var field in item) {
                if(_.endsWith(field, '_changed')) {
                  item[field] = false;
                }
                if(that.isMohicanField(field)) {
                  //do noting
                }
                else {
                  item[field] = item._edit[field];
                  var dataField = that.getDataField(dataFields, field);
                  if(dataField) {
                    that._parseField(item, dataField);
                  }
                  else {
                    that._parseField(item, {name: field});
                  }
                }
              }
              item._state = 'ready';
            });
          return that.theCommitPromise;
        }
      };
      item.rollback = function() {
        delete item._edit;
        item._state = 'ready';
        for(var field in item) {
          if(_.endsWith(field, '_changed')) {
            item[field] = false;
          }
        }
      };
      item.delete = function() {
        item._state = 'deleting';
        if(that.theDeletePromise) {
          return that.theDeletePromise.then(function() {
            item.delete();
          });
        } else {
          var data = {};
          data[layout.doctype] = item._edit;
          that.theDeletePromise = $http.delete(window.MN_BASE + '/' + apiResource + '/' + item[layout.primaryKeyName] + '.json', data)
            .then(function() {
              that.theDeletePromise = null;
              for(var field in item) {
                if(_.endsWith(field, '_changed')) {
                  item[field] = false;
                }
              }
              item._state = 'deleted';
              var index = buffer.indexOf(item);
              if(index !== -1) {
                buffer.splice(index, 1);
              }
              if(that.totalCount) {
                that.totalCount--;
              }
            });
          return that.theDeletePromise;
        }
      };

      item._getDiffs = function() {
        var diffObject = {};
        for(var field in item) {
          if(!that.isMohicanField(field) &&
             item['_' + field + '_changed']) {
            diffObject[field] = item._edit[field];
          }
        }
        return diffObject;
      };
    });
  };

  mohican.mixins.crudMixin.prepareSubDocumentsCrudOperations = function(mnfDoc, collectionField, dataFields) {
    var that = this;
    var buffer = mnfDoc[collectionField];
    buffer.forEach(function(item, index) {
      //item is just a reference to original item in original mnDoc subcollection
      item._state = 'ready';
      //initial create _changed fields on every item
      for(var ifield in item) {
        if(!that.isMohicanField(ifield)) {
          item['_' + ifield + '_changed'] = false;
        }
      }
      item.edit = function() {
        item._state = 'editing';
        //mnfDoc._edit will be created when parent form is switched to 'editing' state
        item._edit = _.cloneDeep(item);//mnfDoc._edit[collectionField][index];
      };

      item.commit = function() {
        item._state = 'committing';
        mnfDoc._state = 'changed';
        mnfDoc['_' + collectionField + '_changed'] = true;
        for(var field in item) {
          if(_.endsWith(field, '_changed')) {
            item[field] = false;
          }
          if(that.isMohicanField(field)) {
            //do noting
          }
          else {
            item[field] = item._edit[field];
            var dataField = that.getDataField(dataFields, field);
            if(dataField) {
              that._parseField(item, dataField);
            }
            else {
              that._parseField(item, {name: field});
            }
          }
        }
        item._state = 'ready';
      };
      item.rollback = function() {
        delete item._edit;
        item._state = 'ready';
        for(var field in item) {
          if(_.endsWith(field, '_changed')) {
            item[field] = false;
          }
        }
      };
      item.delete = function() {
        for(var field in item) {
          if(_.endsWith(field, '_changed')) {
            item[field] = false;
          }
        }
        item._state = 'deleted';
        // var index = buffer.indexOf(item);
        console.log('remove item from index: ', index);
        if(index !== -1) {
          buffer.splice(index, 1);
        }
      };
    });
  };
})(window.mohican);
