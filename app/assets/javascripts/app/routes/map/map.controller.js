//= require angular

(function() {
  'use strict';

  angular
      .module('mapControllerModule', [])
      .controller('MapController', MapController);

  MapController.$inject = ['Echo'];

  function MapController(Echo) {
    var vm = this;

    Echo.repeat('MAP').then(function(result) {
      vm.echo = result;
    });
  }
})();
