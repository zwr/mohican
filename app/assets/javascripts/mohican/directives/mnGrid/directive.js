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
          templateUrl:  'mohican/directives/mnGrid/template.html',
          controller:   'MnGridController',
          controllerAs: 'grid',

          bindToController: true,

          link: function(scope, element, attrs, ctrl, $transcludeFn) {
            ctrl.owner = scope.owner = mohican.scopeLookup(scope);
            scope.compileItForMe = function(itemScope, itemElement) {
              $transcludeFn(itemScope, function(notLinkedClone) {
                itemElement.append(notLinkedClone);
              });
            };
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
