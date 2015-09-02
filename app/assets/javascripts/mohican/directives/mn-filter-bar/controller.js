//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarController', ['$scope', MnFilterBarController]);

  function MnFilterBarController($scope) {
    var vm = this;

    $scope.$watchCollection(function() { return vm.owner.layouts; },
                            function(newValue, oldValue) {
                              if(newValue !== oldValue) {
                                vm.layoutsBefore = _.cloneDeep(vm.owner.layouts);
                              }
                            });


    $scope.$watchCollection(function() { return vm.owner.backendFilters; },
                            function(newValue, oldValue) {
                              if(newValue !== oldValue) {
                                vm.backendFiltersBefore = _.cloneDeep(vm.owner.backendFilters);
                              }
                            });

    vm.changeLayout = function(layoutName) {
      vm.owner.clientLayoutChanged(layoutName).
               then(function() {
                      vm.layoutsBefore = _.cloneDeep(vm.owner.layouts);
                    },
                    function() {
                      vm.owner.layouts = vm.layoutsBefore;
                    });
    };

    vm.changeBackendFilter = function(backendFilterName) {
      vm.owner.getBackendFilter(backendFilterName).
               then(function() {
                      vm.backendFiltersBefore = _.cloneDeep(vm.owner.backendFilters);
                    },
                    function() {
                      vm.owner.backendFilters = vm.backendFiltersBefore;
                    });
    };
  }
})();
