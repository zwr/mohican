//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnItemActionController', ['$scope', mnItemActionController]);

  function mnItemActionController($scope) {
    var vm = this;

    vm.orderId = _findOrderId($scope);

    vm.click = function() {
      console.log(vm.orderId);
    };

    function _findOrderId(scope) {
      if(scope.item && scope.item.Order_ID) {
        return scope.item.Order_ID;
      }
      else {
        return _findOrderId(scope.$parent);
      }
    }
  }
})();
