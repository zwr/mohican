//= require ./template
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican.directives')
    .directive('mnDialogSorcerer', ['$timeout', function($timeout) {
        return {
          restrict:     'E',
          templateUrl:  'mohican/directives/mnDialogSorcerer/template.html',
          link: function(scope, element, attrs, ctrl) {
            //  top:200px;left:200px;
            //scope.mnDialogPosition
            scope.mnDialogPosition = {
              left: 200,
              top: 200
            };
            var dialogElem;
            scope.doCountHeight = true;
            scope.$watch(
              function () {
                dialogElem = element[0].querySelector('.mn-dialog-frame');
                if(dialogElem && scope.doCountHeight) {
                  return {
                    height: dialogElem.clientHeight,
                    width: dialogElem.clientWidth,
                    windowHeight: window.innerWidth,
                    windowWidth: window.innerHeight,
                  }
                }
              },
              function () {
                if(dialogElem) {
                  scope.doCountHeight = true;
                  $timeout(function() {
                    scope.mnDialogPosition.left = (window.innerWidth - dialogElem.clientWidth) / 2;
                    scope.mnDialogPosition.top = (window.innerHeight - dialogElem.clientHeight) / 2;
                    if(scope.mnDialogPosition.left < 0) {
                      scope.mnDialogPosition.left = 0;
                    }
                    if(scope.mnDialogPosition.top < 0) {
                      scope.mnDialogPosition.top = 0;
                    }
                    scope.doCountHeight = true;
                  }, 10);
                }
              },
              true
            );
          }
        };
      }
    ]);
}(window.mohican));