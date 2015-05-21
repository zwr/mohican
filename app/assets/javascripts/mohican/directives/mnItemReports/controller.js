//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnItemReportsController', ['$scope', mnItemReportsController]);

  function mnItemReportsController($scope) {
    var vm = this;

    vm.orderId = _findOrderId($scope);

    function _findOrderId(scope) {
      if(scope.item && scope.item.Order_ID) {
        return scope.item.Order_ID;
      }
      else {
        if(scope.$parent !== null) {
          return _findOrderId(scope.$parent);
        }
        else {
          return null;
        }
      }
    }
  }
})();
