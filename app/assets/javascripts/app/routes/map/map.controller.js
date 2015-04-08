//= require angular

(function() {
  'use strict';
  var mapControllerModule = angular.module('mapControllerModule', []);

  mapControllerModule.controller('MapController', [
    'Echo',
    function mapController(Echo) {
      var ctrl = this;

      Echo.repeat('MAP').then(function(result) {
        ctrl.echo = result;
      });
    },
  ]);
})();
