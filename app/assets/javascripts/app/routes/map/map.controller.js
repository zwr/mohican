//= require angular

var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('MapController', [
  'Echo',
  function mapController(Echo) {
    'use strict';
    var ctrl = this;

    Echo.repeat('MAP').then(function(result) {
      ctrl.echo = result;
    });
  },
]);
