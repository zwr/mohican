//= require ./template
//= require ./controller
//= require_self

(function(mohican) {
  'use strict';

  angular.module('mohican.directives')
    .directive('mnGrid', [function() {
        return {
          scope: {
            owner:        '=?',
            mnSelect:     '@?',
            mnSelectType: '@?',
            mnOnSelect:   '&',
            mnPopup:      '&'
          },
          restrict:     'E',
          transclude:   true,
          templateUrl:  'mohican/directives/mn-grid/template.html',
          controller:   'MnGridController',
          controllerAs: 'grid',

          bindToController: true,

          link: function(scope, element, attrs, ctrl, $transcludeFn) {
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
}(window.mohican));
