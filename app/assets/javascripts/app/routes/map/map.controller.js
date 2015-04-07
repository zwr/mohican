//= require angular

var mapControllerModule = angular.module('mapControllerModule', []);

mapControllerModule.controller('MapController', [
  function () {
    'use strict';
    var ctrl = this;

    ctrl.echo = 'echo';
  },
]);
