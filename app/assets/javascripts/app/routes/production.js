angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'production',
    controller: ['$scope', function($scope) {
      $scope.bookmarks = [
        'Pending orders for current and following week',
        'Orders in production (current orders)',
        'Latest shipped orders',
        'View current active products',
        'View resources'];
      $scope.lines = {
        'Line 1': ['Sahaus', 'Oksien poisto', 'Höyläys', 'Maalaus'],
        'Line 2': ['Picking', 'Packing', 'Shipping', 'Wearhousing']
      };
      $scope.resources = ['forklifts', 'workers', 'material'];
    }]
  });
}]);
