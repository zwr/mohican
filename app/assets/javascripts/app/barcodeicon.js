angular.module('mohican')
  .directive('mnQr', ['$window', function($window) {
      'use strict';
      return {
        restrict: 'E',
        template: '<a ng-hide="!chromeOnAndroid" ng-href="{{mnQfHref}}"><span class="glyphicon glyphicon-qrcode"></span></a>',
        link: function(scope) {
          try {
            var userAgent = $window.navigator.userAgent;
            scope.chromeOnAndroid = userAgent.includes('Android') && userAgent.includes('Chrome');
          }
          catch(err) {
            scope.chromeOnAndroid = false;
          }
          scope.mnQfHref = 'http://zxing.appspot.com/scan?ret=http%3A%2F%2Fdemo.mohican.zwr.fi%2F%23%2Fproducts%2F%7BCODE%7D%2Fdescription&SCAN_FORMATS=QR';
        }
      };
    }
  ]);