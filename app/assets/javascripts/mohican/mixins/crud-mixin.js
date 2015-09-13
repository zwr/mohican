(function(mohican) {
  'use strict';

  mohican.mixins.crudMixin = {};

  _.assign(mohican.mixins.crudMixin, mohican.mixins.dataFieldsMixin);

  mohican.mixins.crudMixin.theCommitPromise = null;
  mohican.mixins.crudMixin.theDeletePromise = null;

  mohican.mixins.crudMixin.prepareDocumentsCrudOperations = function(items, dataFields, $http, $q, apiResource, layout) {
    var that = this;
    items.forEach(function(item) {
      that.prepareDocumentCrudOperations(item, dataFields, $http, $q, apiResource, layout);
    });
  };

  mohican.mixins.crudMixin.prepareNewDoc = function(dataFields, $http, $q, apiResource, layout, newItem) {
    this.prepareDocumentCrudOperations(
      newItem,
      dataFields,
      $http,
      $q,
      apiResource,
      layout,
      true
    );
    newItem.edit();
    newItem.change();
  };

  mohican.mixins.crudMixin.prepareDocumentCrudOperations = function(item, dataFields, $http, $q, apiResource, layout, createNewItem) {
    var that = this;
    if(createNewItem) {
      item._state = 'added';
    }
    else {
      item._state = 'ready';
    }
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
      var deffered = $q.defer();
      item._state = 'committing';
      for(var cfield in item) {
        if(!that.isMohicanField(cfield)) {
          if(angular.isArray(item[cfield])) {
            var subDocs = item[cfield];
            for(var i = subDocs.length - 1; i >= 0; i--) {
              if(subDocs[i]._state === 'deleted') {
                subDocs.splice(i, 1);
              }
            };
          }
        }
      }
      if(that.theCommitPromise) {
        return that.theCommitPromise.then(function() {
          item.commit();
        });
      } else {
        var data = {};
        var commitRemoteCommand;
        var isNewDoc = false;
        if(!item._mnid) {
          isNewDoc = true;
          data[layout.doctype] = item._edit;
          commitRemoteCommand = $http.post(window.MN_BASE + '/' + apiResource + '.json', data);
        }
        else {
          data[layout.doctype] = item._getDiffs();
          commitRemoteCommand = $http.put(window.MN_BASE + '/' + apiResource + '/' + item[layout.primaryKeyName] + '.json', data);
        }
        that.theCommitPromise = commitRemoteCommand
          .then(function(response) {
            var itemFromBackend = response.data;
            that.theCommitPromise = null;
            for(var field in itemFromBackend) {
              if(!that.isMohicanField(field)) {
                item[field] = itemFromBackend[field];
              }
            }

            if(isNewDoc) {
              item._mnid = response.data._mnid;
              if(that.buffer) {
                that.buffer.push(item);
              }
              else {
                that.buffer = [item];
              }
            }

            item._state = 'ready';
            deffered.resolve(response.data);
          }, function() {
            deffered.reject();
          });
        return deffered.promise;
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
            var subDocs = item[field];
            for(var i = subDocs.length - 1; i >= 0; i--) {
              if(subDocs[i]._state === 'added') {
                subDocs.splice(i, 1);
              }
              else {
                item[field][i].rollback();
              }
            };
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
      if(mnfField) {
        item['_' + mnfField + '_changed'] = true;
        if(item._state === 'editing') {
          item._state = 'changed';
        }
      }
      else {
        item._state = 'changed';
      }
    };

    item._getDiffs = function() {
      var diffObject = {};
      for(var field in item._edit) {
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
  };

  mohican.mixins.crudMixin.prepareSubDocumentsCrudOperations = function($q, mnfDoc, collectionField, dataFields) {
    var that = this;
    var items = mnfDoc[collectionField];
    //item is just a reference to original item in original mnfDoc's subcollection
    items.forEach(function(item, index) {
      that.prepareSubDocumentCrudOperations(item, index, $q, mnfDoc, collectionField, dataFields);
    });
  };

  mohican.mixins.crudMixin.addNewSubDoc = function($q, mnfDoc, collectionField, newItem) {
    mnfDoc[collectionField].push(newItem);
    mnfDoc._edit[collectionField].push(_.cloneDeep(newItem));

    this.prepareSubDocumentCrudOperations(
      newItem,
      mnfDoc[collectionField].length - 1,
      $q,
      mnfDoc,
      collectionField,
      [],
      true
    );
    mnfDoc.change(collectionField);
  };

  mohican.mixins.crudMixin.prepareSubDocumentCrudOperations = function(item, index, $q, mnfDoc, collectionField, dataFields, createNewItem) {
    var that = this;

    item._edit = mnfDoc._edit[collectionField][index];
    if(createNewItem) {
      item._state = 'added';
    }
    else {
      item._state = 'editing';
    }
    //initial create _changed fields on every item
    for(var ifield in item) {
      if(!that.isMohicanField(ifield)) {
        if(createNewItem) {
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
        }
      }
      item._state = 'ready';
    };

    item.change = function(changedField) {
      if(item._state === 'editing') {
        item._state = 'changed';
      }
      item['_' + changedField + '_changed'] = true;
      if(mnfDoc._state === 'editing') {
        mnfDoc._state = 'changed';
      }
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
      if(item._state === 'editing') {
        mnfDoc._state = 'changed';
      }
      mnfDoc['_' + collectionField + '_changed'] = true;
      return $q.when();
    };
  };
})(window.mohican);
