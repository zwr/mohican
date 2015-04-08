//= require angular

(function() {
  'use strict';
  var startControllerModule = angular.module('startControllerModule', []);

  startControllerModule.controller('StartController', [
    'Echo',
    function startController(Echo) {
      var ctrl = this;

      Echo.repeat('START').then(function(result) {
        ctrl.echo = result;
      });
    },
  ]);
})();
