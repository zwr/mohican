//= require ./template
//= require_self

angular.module('mohican.directives')
  .directive('mnfDeleteGrid', ['$window', function($window) {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc: '=?'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-delete-grid/template.html',

        link: function(scope, elem, attr, mnfFormGridCtrl) {
          scope.mnfFormGridCtrl = mnfFormGridCtrl;
          scope.confirmDelete = function() {
            if((scope.mnfFormGridCtrl.mnfSubdocumetsGrid === true && scope.mnfDoc._state === 'editing') ||
                scope.mnfFormGridCtrl.mnfSubdocumetsGrid === false && scope.mnfDoc._state === 'ready') {
              if($window.confirm('Are you sure that you want to permanently delete document?')) {
                scope.mnfDoc.delete();
                mnfFormGridCtrl.currentMnfDoc = null;
              }
            }
          };
        }
      };
    }
  ]);
