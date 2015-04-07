//= require angular

var startControllerModule = angular.module('startControllerModule', []);

startControllerModule.controller('StartController', [
  'Echo',
  function startController(Echo) {
    'use strict';
    var ctrl = this;

    Echo.repeat('START').then(function(result) {
      ctrl.echo = result;
    });
  },
]);
