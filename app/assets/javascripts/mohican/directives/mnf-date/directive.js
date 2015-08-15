//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfDate', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfLabel: '@'
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-date/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.moment = moment;
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.dialogOpened = false;
          scope.$watch(function() {
            return scope.mnfDoc._state;
          }, function(newValue) {
            if(newValue === 'editing') {
              scope.mnfDoc._edit[scope.mnfField] = new Date(scope.mnfDoc._edit[scope.mnfField]);
            }
          });
          scope.textChanged = function() {
            scope.mnfDoc['_' + scope.mnfField + '_changed'] = true;
            scope.mnfDoc._state = 'changed';
          };
        }
      };
    }
  ]);
