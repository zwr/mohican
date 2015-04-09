//= require angular

(function() {
  'use strict';

  angular
      .module('startControllerModule', [])
      .controller('StartController', ['actServiceResolve', StartController]);

  function StartController(actServiceResolve) {
    var vm = this;

    function _getActivities() {
      actServiceResolve.pageItems().then(function(result) {
        vm.activities = result;
      });
    }

    _getActivities();

    angular.extend(vm, {
      getActivities: _getActivities,
    });
  }
})();
