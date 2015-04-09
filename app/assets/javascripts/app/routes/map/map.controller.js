//= require angular
//= require_self

(function() {
  'use strict';

  angular
      .module('mapControllerModule', [])
      .controller('MapController', ['echoServiceResolve', MapController]);

  function MapController(echoServiceResolve) {
    var vm = this;

    function _callEcho() {
      echoServiceResolve.echo('hello').then(function(result) {
        vm.echo = result;
      });
    }

    _callEcho();

    angular.extend(vm, {
      callEcho: _callEcho,
    });
  }
})();