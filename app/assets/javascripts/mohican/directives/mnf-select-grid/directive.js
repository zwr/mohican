//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfSelectGrid', [function() {
      'use strict';
      return {
        scope: {
          mnfField: '@',
          mnfDoc:   '=?',
          field:    '=',
          readOnly: '=?'
        },
        restrict:    'E',
        templateUrl: 'mohican/directives/mnf-select-grid/template.html',

        link: function(scope) {
          scope.selectItems = [];
          scope.selectedValues = [];

          scope.mnfDoc[scope.mnfField].split(',').forEach(function(value) {
            scope.selectedValues.push(value);
          });

          scope.field.values.forEach(function(value) {
            scope.selectItems.push({
              name:     value,
              selected: _.contains(scope.selectedValues, value)
            });
          });

          scope.textChanged = function(clickedItem) {
            var index = scope.selectedValues.indexOf(clickedItem);
            if(index > -1) {
              scope.selectedValues.splice(index, 1);
            }
            else {
              scope.selectedValues.push(clickedItem);
            }
            scope.mnfDoc._edit[scope.mnfField] = scope.selectedValues.join(',');
            scope.mnfDoc.change(scope.mnfField);
          };
        }
      };
    }
  ]);
