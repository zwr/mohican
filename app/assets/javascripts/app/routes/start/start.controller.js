//= require angular

(function() {
  'use strict';

  angular
      .module('startControllerModule', [])
      .controller('StartController', StartController);

  StartController.$inject = ['Echo'];

  function StartController(Echo) {
    var vm = this;

    Echo.repeat('START').then(function(result) {
      vm.echo = result;
    });
  }
})();
