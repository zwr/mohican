//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnItemActionController', [mnItemActionController]);

  function mnItemActionController() {
    var vm = this;

    vm.click = function() {
      console.log(vm.item);
    };
  }
})();
