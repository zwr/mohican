//= require_self

(function() {
  'use strict';

  angular.module('mohican').
    directive('mnRightClick', ['$parse', function($parse) {
      return function(scope, element, attrs) {
        var fn = $parse(attrs.mnRightClick);
        element.bind('contextmenu', function(event) {
          scope.$apply(function() {
            if(fn(scope, {$event: event})) {
              event.preventDefault();
            }
          });
        });
      };
    }]);
}());
