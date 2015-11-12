//= require ./template
//= require_self

angular.module('mohican')
  .directive('mnfDeleteGrid', ['$window', function($window) {
      'use strict';
      return {
        restrict: 'E',
        scope:    {
          mnfDoc:     '=?',
          mnOnDelete: '&?'
        },
        require:     '^mnfFormGrid',
        templateUrl: 'mohican/directives/mnf-delete-grid/template.html',
        controller:  ['mnPing', '$scope', function(mnPing, $scope) {
          $scope.mnPing = mnPing;
        }],

        link: function(scope, elem, attrs, mnfFormGridCtrl) {
          scope.mnfFormGridCtrl = mnfFormGridCtrl;
          scope.mnOnDelete = angular.isDefined(scope.mnOnDelete) ? scope.mnOnDelete : function() {};

          scope.confirmDelete = function($event) {
            $event.stopPropagation();
            if(scope.mnfFormGridCtrl.mnfSubdocumetsGrid === true && (scope.mnfDoc._state === 'editing' || scope.mnfDoc._state === 'added')) {
              scope.mnfDoc.delete().then(scope.mnOnDelete);
              mnfFormGridCtrl.currentMnfDoc = null;
            }
            if(scope.mnfFormGridCtrl.mnfSubdocumetsGrid === false && scope.mnfDoc._state === 'ready') {
              if(!scope.mnPing.offlineWarning) {
                if($window.confirm('Are you sure that you want to permanently delete document?')) {
                  scope.mnfDoc.delete().then(scope.mnOnDelete);
                  mnfFormGridCtrl.currentMnfDoc = null;
                }
              }
            }
          };
        }
      };
    }
  ]);
