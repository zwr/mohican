//= require_self

(function() {
  'use strict';

  angular.module('mohican.directives').
    directive('mnRightClick', ['$parse', function($parse) {
      return function(scope, element, attrs) {
        var fn = $parse(attrs.mnRightClick);
        element.bind('contextmenu', function(event) {
          scope.$apply(function() {
            event.preventDefault();
            fn(scope, {$event: event});
          });
        });
      };
    }]);
}());
