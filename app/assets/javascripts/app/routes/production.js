angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'production',
    controller: ['$scope', '$location', '$interval', '$injector', 'productionLinesService', 'mnDataPreloader',
      function($scope, $location, $interval, $injector, productionLinesService, mnDataPreloader) {
        var ctrl = this;
        ctrl.driver = mohican.createBaseDriver($injector);
        ctrl.editLine = function(line) {
          ctrl.driver.popDialog('Rename line ' + line.name, 'app/routes/production_update_line_dialog.html', { line: line, hideFooter: true });
        }
        ctrl.editCell = function(line, cell) {
          ctrl.driver.popDialog('Rename cell ' + cell.name, 'app/routes/production_update_cell_dialog.html', { line: line, cell: cell, hideFooter: true });
        }
        $scope.reload = function() {
          productionLinesService.getProductionLines()
          .then(function (data) {
            $scope.lines = data;
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
        $scope.showStats = function(cellName) {
          // var loc = '/orders?column=delivery_date&qf=true&filters=cell$' + cellName + '$$status$open';
          $location.path('/orders')
                   .search({
                     column:  'delivery_date',
                     qf:      true,
                     filters: 'cell$' + cellName + '$$status$avoinna,tuotannossa'
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
.service('productionLinesService', ['$http', function($http) {
  'use strict';
  return {
    getProductionLines: function() {
      return $http.get('/api/production_lines/stats.json')
      .then(function (response) {
        return response.data;
      });
    }
  };
}]);
