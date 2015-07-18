//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnfFormController', ['mnRouter', '$scope', '$window', MnfFormController]);

  function MnfFormController(mnRouter, $scope, $window) {
    var vm = this;
    vm.hasNotReadyStateItemStateChangeValidator = function() {
      if(vm.mnfDoc._state !== 'ready') {
        var confirmed = $window.confirm('You documents is in ' + vm.mnfDoc._state + ' state. Leaving this page will discard all changes.');
        if(confirmed) {
          vm.mnfDoc._state = 'ready';
        }
        return confirmed;
      }
      else {
        return true;
      }
    };

    mnRouter.addStateChageValidator(vm.hasNotReadyStateItemStateChangeValidator);

    $scope.$on('$destroy', function() {
      mnRouter.removeStateChageValidator(vm.hasNotReadyStateItemStateChangeValidator);
    });
  }
})();
