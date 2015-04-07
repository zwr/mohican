//= require angular

var startControllerModule = angular.module('startControllerModule', []);

startControllerModule.controller('StartController', [
  function () {
    'use strict';
    var ctrl = this;

    ctrl.echo = 'echo';
  },
]);
