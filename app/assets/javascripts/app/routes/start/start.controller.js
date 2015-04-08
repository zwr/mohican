//= require angular

(function() {
  'use strict';

  angular
      .module('startControllerModule', [])
      .controller('StartController', StartController);

  StartController.$inject = ['actServiceResolve'];

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
