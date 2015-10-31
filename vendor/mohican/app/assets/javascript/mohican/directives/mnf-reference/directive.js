//= require ./template
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnfReference', ['$injector', function($injector) {
        return {
          scope: {
            owner:          '=?',
            mnfLabel:       '@',
            mnfRefResource: '@',
            mnfRefId:       '@',
            mnfField:       '@',
            mnfFieldSource: '=',
            readOnly:       '=?'
          },
          restrict:    'E',
          require:     '^mnfForm',
          templateUrl: 'mohican/directives/mnf-reference/template.html',

          link: function(scope, elem, attr, mnfFormCtrl) {
            scope.owner = mohican.scopeLookup(scope);

            scope.mnfDoc = mnfFormCtrl.mnfDoc;

            scope.openRefDialog = function() {
              scope.owner.refResourceController = {};
              var service = $injector.get(attr.mnfRefResource + 'Service');
              mohican.extendResourceDriver(attr.mnfRefResource, scope.owner.refResourceController, service, $injector);
              scope.owner.popDialog('Select from ' + attr.mnfRefResource,
                                    'mohican/directives/mnf-reference/ref-resource-dialog.html',
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
