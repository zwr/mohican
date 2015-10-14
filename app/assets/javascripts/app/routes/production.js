angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    routeName:  'production',
    controller: ['$scope', '$location', '$interval', '$injector', 'productionLinesService', 'mnDataPreloader',
      function($scope, $location, $interval, $injector, productionLinesService, mnDataPreloader) {
        var ctrl = this;
        mohican.extendBaseDriver(ctrl, $injector);
        ctrl.editLine = function(line) {
          $location.path('/lines/' + line.id.$oid);
        };
        $scope.reload = function() {
          productionLinesService.getProductionLines()
          .then(function (data) {
            if($scope.lines) {
              angular.merge($scope.lines, data);
            } else {
              $scope.lines = data;
            }
          });
        };
        $scope.reload();
        mnDataPreloader.load(['orders']);
        $scope.bookmarks = [
          'Pending orders for current and following week',
          'Orders in production (current orders)',
          'Latest shipped orders',
          'View current active products',
          'View resources'];
        $scope.resources = ['forklifts', 'workers', 'material'];
        $scope.showStats = function(cellName, status, timeframe) {
          if(!status || status === 'kaikki') { status = 'avoinna,valmis,tuotannossa'; }
          // '$$delivery_date$Sat_Oct_03_2015_00:00:00_GMT%2B0300---Sat_Oct_03_2015_23:59:59_GMT%2B0300'
          var format_the_timeframe = function(start, end) {
            var fstart = start.toString().replace(/ /g,'_').replace(/\d\d\:\d\d\:\d\d/,'00:00:00');
            var fend = end.toString().replace(/ /g,'_').replace(/\d\d\:\d\d\:\d\d/,'23:59:59');
            return '$$delivery_date$' + fstart + '---' + fend;
          }
          if(timeframe === 'today') { timeframe = format_the_timeframe(new Date(), new Date()); }
          if(timeframe === 'this_week') {
            var curr = new Date; // get current date
            var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
            var last = first + 6;

            var lastday = new Date(curr.setDate(last)).toString();
            var firstday = new Date(curr.setDate(first)).toString();
            timeframe = format_the_timeframe(firstday, lastday);
          }
          $location.path('/orders')
                   .search({
                     column:  'delivery_date',
                     qf:      true,
                     filters: 'cell$' + cellName + '$$status$' + status + timeframe
                   });
        };
        var myInterval = $interval(function() {
          $scope.reload();
        }, 2000);
        $scope.$on('$destroy', function() {
          $interval.cancel(myInterval);
          myInterval = undefined;
        });
      }]
  });
}])
.service('productionLinesService', ['$http', '$q', function($http, $q) {
  'use strict';
  return {
    lastKnownProductionLines: null,
    getKnownProductionLines: function() {
      if(this.lastKnownProductionLines) {
        return $q.when(lastKnownProductionLines);
      } else {
        return this.getProductionLines();
      }
    },
    getProductionLines: function() {
      return $http.get('/api/lines/stats.json')
      .then(function (response) {
        return response.data;
      });
    }
  };
}]);
