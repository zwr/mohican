//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnItemActionController', ['$scope', mnItemActionController]);

  function mnItemActionController($scope) {
    var vm = this;

    vm.click = function() {
      console.log($scope.$parent.$parent.item.Order_ID);
    };
  }
})();
