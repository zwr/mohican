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
          clientViewChanged: '&',
          fields: '=',
          items: '=',
          quickFilterShown: '=',
          quickFilterFocus: '=',
          serviceDataLoaded: '=',
          orderColumn: '=',
          orderDirection: '=',
          filters: '=',
        },
        templateUrl: 'mohican/directives/mnGrid/template.html',
        controller: 'MnGridController',
        controllerAs: 'grid',
        bindToController: true,
        link: function(scope, element, attrs, ctrl, $transcludeFn) {
          scope.compileItForMe = function(itemScope, itemElement) {
            $transcludeFn(itemScope, function(notLinkedClone, cloneScope){
              itemElement.append(notLinkedClone);
            });
          };
        },
      };
    },
  ]);

angular.module('mohican.directives')
  .directive('mnGridActions', [function() {
    return {
      scope: false,
      link: function(scope, element) {
        scope.ctrl = scope.$parent.$parent.ctrl;
        scope.ctrlScope = scope.$parent.$parent;
        scope.$parent.compileItForMe(scope, element);
      },
    };
  }]);
