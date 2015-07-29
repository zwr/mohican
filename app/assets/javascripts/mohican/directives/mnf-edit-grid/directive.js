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
          scope.$watch(function() { return mnfFormGridCtrl.currentMnfDoc; },
                        function(newValue) {
                          if(newValue !== scope.mnfDoc) {
                            scope.mnfDoc.rollback();
                          }
                          scope.currentMnfDoc = newValue;
                        });

          scope.editItem = function() {
            scope.mnfDoc.edit();
            mnfFormGridCtrl.currentMnfDoc = scope.mnfDoc;
          };
        }
      };
    }
  ]);
