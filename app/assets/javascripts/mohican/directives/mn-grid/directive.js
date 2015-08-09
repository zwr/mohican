//= require ./template
//= require ./controller
//= require_self

(function(mohican) {
  'use strict';

  angular.module('mohican.directives')
    .directive('mnGrid', ['$interval', '$window', function($interval, $window) {
        return {
          scope: {
            owner:            '=?',
            mnSelect:         '@?',
            mnSelectType:     '@?',
            mnOnSelect:       '&',
            mnPopup:          '&',
            mnGridFillHeight: '@?'
          },
          restrict:     'E',
          transclude:   true,
          templateUrl:  'mohican/directives/mn-grid/template.html',
          controller:   'MnGridController',
          controllerAs: 'grid',

          bindToController: true,

          link: function(scope, element, attrs, ctrl, $transcludeFn) {
            ctrl.hasContextMenu = attrs.mnPopup ? true : false;
            if(scope.grid.mnGridFillHeight) {
              scope.setHeight = function(h) {
                element.first().children().first().height(h - element[0].getBoundingClientRect().top - 41);
              };
              var timeoutId;
              timeoutId = $interval(function() {
                scope.setHeight($window.innerHeight);
              }, 300);
              element.on('$destroy', function() {
                $interval.cancel(timeoutId);
              });
              angular.element($window).bind('resize', function(e) {
                if(e.srcElement) {
                  scope.setHeight(e.srcElement.innerHeight);
                }
              });
              scope.setHeight($window.innerHeight);
            }

            if(!ctrl.owner) {
              ctrl.owner = scope.owner = mohican.scopeLookup(scope);
            }
            scope.compileItForMe = function(itemScope, itemElement) {
              $transcludeFn(itemScope, function(notLinkedClone) {
                itemElement.append(notLinkedClone);
              });
            };
            var popupElem = element[0].querySelector('.mn-context-menu');
            scope.$watch(
              function () {
                return {
                  top:    popupElem.clientTop,
                  height: popupElem.clientHeight
                };
              },
              function () {
                if(ctrl.menuPosition) {
                  if(popupElem.offsetTop + popupElem.offsetHeight >= element[0].getBoundingClientRect().bottom - 50) {
                    ctrl.menuPosition.top = popupElem.offsetTop - popupElem.offsetHeight;
                  }
                  if(popupElem.offsetLeft + popupElem.offsetWidth >= element[0].getBoundingClientRect().right - 50) {
                    ctrl.menuPosition.left = popupElem.offsetLeft - popupElem.offsetWidth;
                  }
                }
              },
              true
            );
          }
        };
      }
    ]);

  angular.module('mohican.directives')
    .directive('mnGridActions', [function() {
      return {
        scope: false,
        link:  function(scope, element) {
          scope.ctrl = scope.$parent.owner;
          scope.$parent.compileItForMe(scope, element);
        }
      };
    }]);
  angular.module('mohican.directives')
    .directive('modalFitInWindow',['$interval', '$window',
      function($interval, $window) {
        return {
          scope: false,
          restrict: 'A',
          link: function(scope, element, attrs, ctrl, $transcludeFn) {
            scope.setHeight = function(h) {
              // element.first().children().first().height(h - element[0].getBoundingClientRect().top - 200);
              var offset = 30;
              if(element.next().hasClass('modal-footer')) {
                offset += element.next().outerHeight();
              }
              element.css('max-height', h - element[0].getBoundingClientRect().top - offset);
            };
            var timeoutId;
            timeoutId = $interval(function() {
              scope.setHeight($window.innerHeight);
            }, 300);
            element.on('$destroy', function() {
              $interval.cancel(timeoutId);
            });
            angular.element($window).bind('resize', function(e) {
              if(e.srcElement) {
                scope.setHeight(e.srcElement.innerHeight);
              }
            });
            scope.setHeight($window.innerHeight);
          }
        };
      }]);
}(window.mohican));
