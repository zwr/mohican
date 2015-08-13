//= require ./template
//= require_self

angular.module('mohican.directives')
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
          scope.mnfDoc = mnfFormCtrl.mnfDoc;
          scope.status = {
            opened: false
          };
          scope.$watch(function() {
            return scope.status.opened;
          }, function(newValue) {
            console.log(newValue);
          });
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
          scope.dateFormated = function() {
            return moment(scope.mnfDoc[scope.mnfField]).format('DD.MM.YYYY.');
          };
          scope.openDateDialog = function() {
            console.log('open');
            scope.status.opened = true;
          };
        }
      };
    }
  ]);
