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
        return {
          message: 'Your documents is in ' + vm.mnfDoc._state + ' state. Leaving this page will discard all changes.',
          resolve: function() {
            vm.mnfDoc._state = 'ready';
            console.log('resolve');
          },
          reject: function() { console.log('reject'); }
        };
      }
      else {
        return null;
      }
    };

    mnRouter.addStateChageValidator(vm.hasNotReadyStateItemStateChangeValidator);

    $scope.$on('$destroy', function() {
      mnRouter.removeStateChageValidator(vm.hasNotReadyStateItemStateChangeValidator);
    });
  }
})();
