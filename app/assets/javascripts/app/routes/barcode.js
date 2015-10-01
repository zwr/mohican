angular.module('id5').config(['mnRouterProvider', function(mnRouterProvider) {
  'use strict';
  mnRouterProvider.addSimpleRoute({
    name:       'barcode',
    controller: ['$scope', '$location', '$injector',
      function($scope, $location, $injector) {
        var ctrl = this;
        mohican.extendBaseDriver(ctrl, $injector);
        $scope.barcode = $location.path().split("/")[2];
        $scope.cell_index = parseInt($scope.barcode.replace('CELL',''));
      }]
  });
}]);
