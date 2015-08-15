//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfEditGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc: '=?'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-edit-grid/template.html',

        link: function(scope, elem, attr, mnfFormGridCtrl) {
          scope.mnfFormGridCtrl = mnfFormGridCtrl;
          scope.editItem = function() {
            if(scope.mnfDoc._state === 'ready') {
              scope.mnfDoc.edit();
              mnfFormGridCtrl.setCurrenEditingDoc(scope.mnfDoc);
            }
          };
        }
      };
    }
  ]);
