angular.module('mnOldDirectives').
    directive('mnFullHeight', [
      '$window', function($window) {
        'use strict';
        return {
          restrict: 'A',
          link: function(scope, elem) {
            scope.setHeight = function(element, h) {
              return element.attr('style', 'min-height: ' + h + 'px;');
            };
            angular.element($window).bind('resize', function(e) {
              return scope.setHeight(elem, e.srcElement.innerHeight);
            });
            return scope.setHeight(elem, $window.innerHeight);
          },
        };
      },
    ]);
