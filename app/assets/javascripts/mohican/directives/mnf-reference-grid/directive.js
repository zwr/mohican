//= require ./template
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnfReferenceGrid', ['$injector', function($injector) {
        return {
          scope: {
            owner:          '=?',
            mnfRefResource: '@',
            mnfRefId:       '@',
            mnfField:       '@',
            mnfDoc:         '=?',
            mnfFieldSource: '=',
            readOnly:       '=?'
          },
          restrict:    'E',
          templateUrl: 'mohican/directives/mnf-reference-grid/template.html',

          link: function(scope, elem, attr) {
            scope.owner = mohican.scopeLookup(scope);

            scope.openRefDialog = function() {
              scope.owner.refResourceController = {};
              var service = $injector.get(attr.mnfRefResource + 'Service');
              mohican.extendResourceDriver(attr.mnfRefResource, scope.owner.refResourceController, service, $injector);
              scope.owner.popDialog('Select from ' + attr.mnfRefResource,
                                    'mohican/directives/mnf-reference-grid/ref-resource-dialog.html',
                                    { hideFooter: true }).
                          then(function(selectedItems) {
                            if(selectedItems.length > 0) {
                              var selectedItem = selectedItems[0];
                              scope.mnfDoc._edit[scope.mnfRefId] = selectedItem[scope.owner.refResourceController.primaryKeyName];
                              scope.mnfDoc['_' + scope.mnfRefId + '_changed'] = true;
                              var fieldLabel = '';
                              scope.mnfFieldSource.forEach(function(field) {
                                fieldLabel += ' ' + selectedItem[field];
                              });
                              scope.mnfDoc._edit[scope.mnfField] = _.trim(fieldLabel);
                              scope.mnfDoc.change(scope.mnfField);
                            }
                          });
            };
          }
        };
      }
    ]);
})(window.mohican);
