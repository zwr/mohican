//= require ./template
//= require_self

angular.module('mohican.directives')
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
          scope.editItem = function() {
            scope.mnfDoc.edit();
            mnfFormGridCtrl.setCurrenEditingDoc(scope.mnfDoc);
          };
        }
      };
    }
  ]);
