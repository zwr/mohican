//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnfFormController', ['mnRouter', '$scope', '$window', MnfFormController]);

  function MnfFormController(mnRouter, $scope, $window) {
    var vm = this;
    vm.mnfCrudShown = angular.isDefined(vm.mnfCrudShown) ? vm.mnfCrudShown : true;
    vm.hasNotReadyStateItemStateChangeValidator = function(fullStateReload) {
      //do not validate if only "after '?' params" are changed (fullStateReload === true)
      if(fullStateReload && vm.mnfDoc._state !== 'ready' && vm.mnfDoc._state !== 'deleted') {
        return {
          message: 'Your current editing document is in ' + vm.mnfDoc._state + ' state.',
          resolve: function() {
            vm.mnfDoc.rollback();
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
