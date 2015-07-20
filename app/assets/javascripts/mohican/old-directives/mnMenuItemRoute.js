(function(mohican) {
  'use strict';
  angular.module('mnOldDirectives')
    .directive('mnMenuItemRoute', ['mnTranslations', function(mnTranslations) {
        return {
          restrict: 'E',

          scope: {
            sref: '@?'
          },
          link: {
            pre: function(scope, elem, attr, ctrl, transclude) {
              transclude(function(clone) {
                scope.mnText = mnTranslations.t(clone.text());
                if(scope.sref == null) {
                  scope.sref = mohican.toHyphen(clone.text());
                }
                scope.srefResolved = scope.sref;
              });
            },
            post: function() {
            }
          },
          transclude: true,
          template:   '<a ui-sref-active="mn-menu-item-route-active" ui-sref="{{srefResolved}}"><span>{{mnText}}</span></a>'
        };
      }
    ]);

})(window.mohican);
