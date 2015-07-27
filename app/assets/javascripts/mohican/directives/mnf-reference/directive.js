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

            mnfRefResource: '@'
          },
          restrict:    'E',
          require:     '^mnfForm',
          templateUrl: 'mohican/directives/mnf-reference/template.html',

          link: function(scope, elem, attr, mnfFormCtrl) {
            scope.owner = mohican.scopeLookup(scope);

            scope.mnfDoc = mnfFormCtrl.mnfDoc;
            scope.textChanged = function() {
              scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
              scope.mnfDoc._state = 'changed';
            };
            scope.openRefDialog = function() {
              scope.owner.refResourceController = {};
              mohican.extendResourceDriver(scope.owner.refResourceController, service);
              scope.owner.popDialog('Selected Users', 'mohican/directives/mnf-reference/ref-resource-dialog.html');
            };
          }
        };
      }
    ]);
})(window.mohican);
