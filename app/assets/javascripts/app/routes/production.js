angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'production',
    controller: ['$scope', '$location', '$interval', 'productionLinesService', 'ordersService',
    function($scope, $location, $interval, productionLinesService, ordersService) {
      $scope.reload = function() {
        productionLinesService.getProductionLines()
        .then(function (data) {
          $scope.lines = data;
        });
      }
      $scope.reload();
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
                   column: 'delivery_date',
                   qf: true,
                   filters: 'cell$' + cellName + '$$status$avoinna,tuotannossa',
                 })
      }
      var myInterval = $interval(function(){
        $scope.reload();
      }, 2000);
      $scope.$on("$destroy", function(){
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
