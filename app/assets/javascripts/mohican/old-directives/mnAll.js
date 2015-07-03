angular.module('mnOldDirectives', []).directive('mnNavbar', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    template: '<nav class="mn-navbar navbar navbar-static-top navbar-inverse" role="navigation"><div class="container-fluid" ng-transclude></div></nav>'
  };
}).directive('mnNavbarTitle', function() {
  var ret;
  return ret = {
    restrict: 'E',
    scope: {
      mnRef: '@?'
    },
    transclude: true,
    template: '<div class="mn-navbar-title navbar-header pull-left"><a class="navbar-brand" href="{{mnRef || \'/#/\'}}"><span ng-transclude></span></a></div>'
  };
}).directive('mnNavbarRight', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    templateUrl: "mohican/old-directives/templates/mnNavbarRight.html"
  };
}).directive('mnNavbarCollapsible', ['$window', function($window) {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    link: function(scope) {
      scope.isCollapsed = true;
      angular.element($window).bind('resize', function () {
        scope.isCollapsed = true;
        scope.$apply();
      });
    },
    template: '<div id="navbar" class="navbar-collapse collapse" collapse="isCollapsed" ng-transclude></div>'
  };
}]).directive('mnNavbarCollapsibleLeft', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    template: '<ul class="nav navbar-nav" ng-transclude>'
  };
}).directive('mnNavbarCollapsibleRight', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    template: '<ul class="nav navbar-nav navbar-right" ng-transclude>'
  };
}).directive('mnMenuGroup', ['mnTranslations', function(mnTranslations) {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    scope: {
      mnText: '@'
    },
    link: function(scope) {
      scope.mnTextTranslated = mnTranslations.t(scope.mnText);
    },
    template: '<li class="dropdown" dropdown on-toggle="toggled(open)"><a class="dropdown-toggle" dropdown-toggle><span>{{mnTextTranslated}}</span><span class="caret"/></a><ul class="dropdown-menu" ng-transclude/></li>'
  };
}])
.directive('mnMenuGroupItem', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    template: '<li ng-transclude/>'
  };
}).directive('mnMenuDivider', function() {
  var ret;
  return ret = {
    restrict: 'E',
    template: '<li class="divider"/>'
  };
}).directive('mnMenuHeader', function() {
  var ret;
  return ret = {
    restrict: 'E',
    transclude: true,
    template: '<li class="dropdown-header" ng-transclude/>'
  };
});

// angular.module('mohican').directive('mnAlerts', function() {
//   var ret;
//   return ret = {
//     restrict: 'E',
//     template: '<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>'
//   };
// });
