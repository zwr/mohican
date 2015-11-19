angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    routeName:  'barcode',
    controller: function($injector, $scope) {
      var $location = $injector.get('$location');
      var productionLinesService = $injector.get('productionService');
      var mnRouter = $injector.get('mnRouter');
      var ctrl = this;
      mohican.extendBaseDriver(ctrl, $injector);
      $scope.barcode = $location.path().split('/')[2];
      $scope.cellIndex = parseInt($scope.barcode.replace('CELL', ''));

      if($scope.cellIndex < 4 && $scope.cellIndex >= 0) {
        productionLinesService.getKnownProductionLines()
        .then(function(lines) {
          $scope.cellName = lines[0].cells[$scope.cellIndex].name;
          var formatTheTimeframe = function(start, end) {
            var fstart = start.toString().replace(/ /g, '_').replace(/\d\d\:\d\d\:\d\d/, '00:00:00');
            var fend = end.toString().replace(/ /g, '_').replace(/\d\d\:\d\d\:\d\d/, '23:59:59');
            return '$$delivery_date$' + fstart + '---' + fend;
          };
          var timeframe = formatTheTimeframe(new Date(), new Date());
          $location.path('/orders')
                   .search({
                     column:  'status',
                     qf:      'true',
                     filters: 'cell$' + $scope.cellName + '$$status$avoinna,valmis,tuotannossa' + timeframe
                   });
          //http://192.168.6.108:3000/#/barcode/CELL1
        });
      } else {
        mnRouter.redirectTo('production');
      }
    }
  });

  // mnRouterProvider.addRedirecRoute('barcode', function($location, $injector) {
  //   var barcode = $location.path().split('/')[2];
  //   var cellIndex = parseInt(barcode.replace('CELL',''));
  //   return {
  //     resource: 'orders',
  //     params:   {
  //       page: cellIndex
  //     }
  //   };
  // });

  // mnRouterProvider.addRedirecRoute('barcode', function($location, $injector) {
  //   var deffered = $injector.get('$q').defer();
  //   var barcode = $location.path().split('/')[2];
  //   var cellIndex = parseInt(barcode.replace('CELL',''));
  //
  //   var $timeout = $injector.get('$timeout');
  //
  //   $timeout(function() {
  //     deffered.resolve({
  //       resource: 'orders',
  //       params:   {
  //         page: cellIndex
  //       }
  //     });
  //   }, 2000);
  //
  //   return deffered.promise;
  // });
}]);
