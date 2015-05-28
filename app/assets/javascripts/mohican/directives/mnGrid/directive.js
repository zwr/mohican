//= require ./template
//= require ./controller
//= require_self

angular.module('mohican.directives')
  .directive('mnGrid', [function() {
      'use strict';
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          owner: '=?'
        },
        templateUrl: 'mohican/directives/mnGrid/template.html',
        controller: 'MnGridController',
        controllerAs: 'grid',
        bindToController: true,
        link: function(scope, element, attrs, ctrl, $transcludeFn) {
          var i, runner = scope;
          for(i=0;(!scope.owner) && i<10;i++) {
            if(runner.$parent && runner.$parent.ctrl) {
              scope.owner = runner.$parent.ctrl;
              break;
            }
            runner = runner.$parent;
          }
          ctrl.owner = scope.owner;
          scope.compileItForMe = function(itemScope, itemElement) {
            $transcludeFn(itemScope, function(notLinkedClone) {
              itemElement.append(notLinkedClone);
            });
          };
        },
      };
    },
  ]);

angular.module('mohican.directives')
  .directive('mnGridActions', [function() {
    'use strict';
    return {
      scope: false,
      link: function(scope, element) {
        scope.ctrl = scope.$parent.owner;
        scope.$parent.compileItForMe(scope, element);
      },
    };
  }]);
