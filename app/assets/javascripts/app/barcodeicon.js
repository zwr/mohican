angular.module('mohican')
  .directive('mnQr', ['$window', '$location', function($window, $location) {
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
          var retUrl = 'http://' + $location.host();
          if($location.port() && $location.port() !== '80') { retUrl = retUrl + ':' + $location.port(); }
          scope.mnQfHref = 'http://zxing.appspot.com/scan?ret=' + encodeURIComponent(retUrl + '/#/barcode/{CODE}') + '&SCAN_FORMATS=QR';
        }
      };
    }
  ]);
