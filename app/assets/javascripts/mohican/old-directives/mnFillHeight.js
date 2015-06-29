angular.module('mnOldDirectives').
    directive('mnFillHeight', [
      '$window', '$interval', function($window, $interval) {
        'use strict';
        return {
          restrict: 'A',
          link: function(scope, elem) {
            scope.setHeight = function(element, h) {
              var currentStyle;
              currentStyle = element.attr('style').replace(/height: \d*px; */, '');
              return element.attr('style', 'height: ' + (h - 165) + 'px; ' + currentStyle);
            };
            var timeoutId;
            timeoutId = $interval(function() {
              return scope.setHeight(elem, $window.innerHeight);
            }, 300);
            elem.on('$destroy', function() {
              return $interval.cancel(timeoutId);
            });
            angular.element($window).bind('resize', function(e) {
              if(e.srcElement) {
                return scope.setHeight(elem, e.srcElement.innerHeight);
              }
            });
            return scope.setHeight(elem, $window.innerHeight);
          },
        };
      },
    ]);
