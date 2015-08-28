angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'production',
    controller: ['$scope', 'productionLinesService', function($scope, productionLinesService) {
      productionLinesService.getProductionLines()
      .then(function (data) {
        $scope.lines = data;
      });
      $scope.bookmarks = [
        'Pending orders for current and following week',
        'Orders in production (current orders)',
        'Latest shipped orders',
        'View current active products',
        'View resources'];
      $scope.resources = ['forklifts', 'workers', 'material'];
    }]
  });
}])
.service('productionLinesService', ['$http', function($http) {
  'use strict';
  return {
    getProductionLines: function() {
      return $http.get('/api/production_lines.json')
      .then(function (response) {
        return response.data;
      });
    }
  };
}]);
