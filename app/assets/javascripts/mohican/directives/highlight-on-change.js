angular.module('mohican')
  .directive('mnHighlightOnChange', ['$timeout', function($timeout) {
      'use strict';
      return {
        link: function($scope, element, attrs) {
          $scope.$watch(attrs.mnHighlightOnChange, function(oldv, newv) {
            if(oldv !== newv) {
              element.removeClass(attrs.mnHighlightOnChangeRemoveClass);
              element.addClass(attrs.mnHighlightOnChangeAddClass);
              $timeout(function() {
                element.addClass(attrs.mnHighlightOnChangeRemoveClass);
                element.removeClass(attrs.mnHighlightOnChangeAddClass);
              }, 1000).then(function() {
                $timeout(function() {
                  element.removeClass(attrs.mnHighlightOnChangeRemoveClass);
                  element.addClass(attrs.mnHighlightOnChangeAddClass);
                }, 1000);
              }).then(function() {
                $timeout(function() {
                  element.addClass(attrs.mnHighlightOnChangeRemoveClass);
                  element.removeClass(attrs.mnHighlightOnChangeAddClass);
                }, 3000);
              });
            }
          }, attrs.mnHighlightOnChangeObject);
        }
      };
    }]);

//http://stackoverflow.com/questions/19016045/how-do-i-make-something-blink-when-a-variable-changes-with-angular
// Notice that there are two ways to call this well from our example:
//
//      %div.panel(mn-highlight-on-change='cell.today' mn-highlight-on-change-object='true')
//      %div.panel(mn-highlight-on-change='cell.today.tuotannossa')
//
// In first example, second attribute tells that the change should be watched on the cell.today as
// an object, so changes deep in the object would be noticed. In the second example, we only watch
// one scalar value, but this one (in this example) is guaranteed to have changed if anything else
// has changed, and is also way more efficient - but will not notice if the cell name has changed.
