(function(mohican) {
  'use strict';

  mohican.mixins.crudMixin = {};

  _.assign(mohican.mixins.crudMixin, mohican.mixins.dataFieldsMixin);

  mohican.mixins.crudMixin.theCommitPromise = null;
  mohican.mixins.crudMixin.theDeletePromise = null;

  mohican.mixins.crudMixin.prepareDocumentsCrudOperations = function(items, dataFields, $http, $q, apiResource, layout) {
    var that = this;
    items.forEach(function(item) {
      item._state = 'ready';
      //initial create _changed fields on every item
      for(var ifield in item) {
        if(!that.isMohicanField(ifield)) {
          item['_' + ifield + '_changed'] = false;
          if(angular.isArray(item[ifield])) {
            for(var i = 0; i < item[ifield].length; i++) {
              item[ifield][i]._state = 'ready';
            }
          }
        }
      }
      item.edit = function() {
        item._state = 'editing';
        item._edit = _.cloneDeep(item);
        for(var efield in item) {
          if(!that.isMohicanField(efield)) {
            if(angular.isArray(item[efield])) {
              that.prepareSubDocumentsCrudOperations($q, item, efield, []);
            }
          }
        }
      };

      item.commit = function() {
        item._state = 'committing';
        for(var cfield in item) {
          if(!that.isMohicanField(cfield)) {
            if(angular.isArray(item[cfield])) {
              item[cfield] = item[cfield].filter(function(itm) {
                return itm._state !== 'deleted';
              });
            }
          }
        }
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
                if(angular.isArray(item[field])) {
                  if(!that.isMohicanField(field)) {
                    for(var si = 0; si < item[field].length; si++) {
                      item[field][si].commit();
                    }
                  }
                }
                else {
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
          if(!that.isMohicanField(field)) {
            if(angular.isArray(item[field])) {
              for(var si = 0; si < item[field].length; si++) {
                item[field][si].rollback();
              }
            }
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
              var index = that.buffer.indexOf(item);
              if(index !== -1) {
                that.buffer.splice(index, 1);
              }
              if(that.totalCount && that.totalCount > 0) {
                that.totalCount--;
              }
              if(that.topIndex && that.topIndex > 0) {
                that.topIndex--;
              }
            });
          return that.theDeletePromise;
        }
      };

      item.change = function(mnfField) {
        item['_' + mnfField + '_changed'] = true;
        item._state = 'changed';
      };

      item._getDiffs = function() {
        var diffObject = {};
        for(var field in item) {
          if(!that.isMohicanField(field) &&
             item['_' + field + '_changed']) {
            if(angular.isArray(item[field])) {
              diffObject[field] = item[field];
            }
            else {
              diffObject[field] = item._edit[field];
            }
          }
        }
        return diffObject;
      };
    });
  };

  mohican.mixins.crudMixin.prepareSubDocumentsCrudOperations = function($q, mnfDoc, collectionField, dataFields) {
    var that = this;
    var items = mnfDoc[collectionField];
    //item is just a reference to original item in original mnfDoc subcollection
    items.forEach(function(item, index) {
      mohican.mixins.crudMixin.prepareSubDocumentCrudOperations(item, index, $q, mnfDoc, collectionField, dataFields);
    });
  };

  mohican.mixins.crudMixin.addNewSubitem = function($q, mnfDoc, collectionField, newItem) {
    mnfDoc[collectionField].push(newItem);
    mnfDoc._edit[collectionField].push(_.cloneDeep(newItem));
    mohican.mixins.crudMixin.prepareSubDocumentCrudOperations(
      newItem,
      mnfDoc[collectionField].length - 1,
      $q,
      mnfDoc,
      collectionField,
      [],
      true
    );
    mnfDoc._state = 'changed';
    mnfDoc['_' + collectionField + '_changed'] = true;
  };

  mohican.mixins.crudMixin.prepareSubDocumentCrudOperations = function(item, index, $q, mnfDoc, collectionField, dataFields, newItem) {
    var that = this;

    item._edit = mnfDoc._edit[collectionField][index];
    if(newItem) {
      item._state = 'added';
    }
    else {
      item._state = 'editing';
    }
    //initial create _changed fields on every item
    for(var ifield in item) {
      if(!that.isMohicanField(ifield)) {
        if(newItem) {
          item['_' + ifield + '_changed'] = true;
        }
        else {
          item['_' + ifield + '_changed'] = false;
        }
      }
    }

    item.commit = function() {
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

    item.change = function(changedField) {
      item._state = 'changed';
      item['_' + changedField + '_changed'] = true;
      mnfDoc._state = 'changed';
      mnfDoc['_' + collectionField + '_changed'] = true;
    };

    item.rollback = function() {
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
      mnfDoc._state = 'changed';
      mnfDoc['_' + collectionField + '_changed'] = true;
      return $q.when();
    };
  };
})(window.mohican);
