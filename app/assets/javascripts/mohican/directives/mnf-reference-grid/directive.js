//= require ./template
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnfReferenceGrid', ['$injector', function($injector) {
        return {
          scope: {
            owner:          '=?',
            mnfRefResource: '@',
            mnfRefId:       '@',
            mnfField:       '@',
            mnfDoc:         '=?',
            mnfFieldSource: '='
          },
          restrict:    'E',
          templateUrl: 'mohican/directives/mnf-reference-grid/template.html',

          link: function(scope, elem, attr) {
            scope.owner = mohican.scopeLookup(scope);

            scope.openRefDialog = function() {
              scope.owner.refResourceController = {};
              scope.owner.refResourceController.onItemSelect = function(selectedItems) {
                if(selectedItems.length > 0) {
                  var selectedItem = selectedItems[0];
                  scope.mnfDoc._edit[scope.mnfRefId] = selectedItem[scope.owner.refResourceController.primaryKeyName];
                  scope.mnfDoc['_' + scope.mnfRefId + '_changed'] = true;
                  var fieldLabel = '';
                  scope.mnfFieldSource.forEach(function(field) {
                    fieldLabel += ' ' + selectedItem[field];
                  });
                  scope.mnfDoc._edit[scope.mnfField] = _.trim(fieldLabel);
                  scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
                  scope.mnfDoc._state = 'changed';
                  scope.owner.closeDialog();
                }
              };
              var service = $injector.get(attr.mnfRefResource + 'Service');
              mohican.extendResourceDriver(scope.owner.refResourceController, service);
              scope.owner.popDialog('Select from ' + attr.mnfRefResource,
                                    'mohican/directives/mnf-reference-grid/ref-resource-dialog.html',
                                    { hideFooter: true });
            };
          }
        };
      }
    ]);
})(window.mohican);
