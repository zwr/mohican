//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnfFormController', ['mnRouter', '$scope', '$window', MnfFormController]);

  function MnfFormController(mnRouter, $scope, $window) {
    var vm = this;
    vm.mnfCrudShown = angular.isDefined(vm.mnfCrudShown) ? vm.mnfCrudShown : true;
    vm.hasNotReadyStateItemStateChangeValidator = function(fullStateChanged) {
      //do not validate if only "after '?' params" are changed (fullStateChanged === true)
      if(fullStateChanged && vm.mnfDoc._state !== 'ready' && vm.mnfDoc._state !== 'deleted') {
        var confirmed = $window.confirm('Your documents is in ' + vm.mnfDoc._state + ' state. Leaving this page will discard all changes.');
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
