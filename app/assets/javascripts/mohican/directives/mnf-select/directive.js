//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfSelect', [function() {
      'use strict';
      return {
        scope: {
          mnfField:      '@',
          mnfLabel:      '@',
          allowedValues: '='
        },
        restrict:    'E',
        require:     '^mnfForm',
        templateUrl: 'mohican/directives/mnf-select/template.html',

        link: function(scope, elem, attr, mnfFormCtrl) {
          scope.mnfDoc = mnfFormCtrl.mnfDoc;

          scope.selectItems = [];
          scope.selectedValues = [];

          if(scope.mnfDoc[scope.mnfField]) {
            scope.mnfDoc[scope.mnfField].split(',').forEach(function(value) {
              scope.selectedValues.push(value);
            });
          }

          scope.allowedValues.forEach(function(value) {
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
