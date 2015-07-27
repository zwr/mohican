//= require ./template
//= require_self
(function(mohican) {
  angular.module('mohican.directives')
    .directive('mnfReference', ['usersService', function(service) {
        'use strict';
        return {
          scope: {
            owner:    '=?',
            mnfField: '@',
            mnfLabel: '@',
            mnfRefId: '@',

            mnfRefFields: '=',
            mnfRefResource: '@'
          },
          restrict:    'E',
          require:     '^mnfForm',
          templateUrl: 'mohican/directives/mnf-reference/template.html',

          link: function(scope, elem, attr, mnfFormCtrl) {
            scope.owner = mohican.scopeLookup(scope);

            scope.mnfDoc = mnfFormCtrl.mnfDoc;

            scope.openRefDialog = function() {
              scope.owner.refResourceController = {};
              scope.owner.refResourceController.onItemSelect = function(selectedItems) {
                if(selectedItems.length > 0) {
                  var selectedItem = selectedItems[0];
                  scope.mnfDoc._edit[scope.mnfRefId] = selectedItem[scope.owner.refResourceController.primaryKeyName];
                  scope.mnfDoc['_' + scope.mnfRefId + '_changed'] = true;
                  var fieldLabel = '';
                  scope.mnfRefFields.forEach(function(field) {
                    fieldLabel += ' ' + selectedItem[field];
                  });
                  scope.mnfDoc._edit[scope.mnfField] = _.trim(fieldLabel);
                  scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
                  scope.mnfDoc._state = 'changed';
                  scope.owner.closeDialog();
                }
              }
              mohican.extendResourceDriver(scope.owner.refResourceController, service);
              scope.owner.popDialog('Selected Users', 'mohican/directives/mnf-reference/ref-resource-dialog.html');
            };
          }
        };
      }
    ]);
})(window.mohican);
