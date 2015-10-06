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


    $scope.$watchCollection(function() { return vm.owner.documentFilters; },
                            function(newValue, oldValue) {
                              vm.documentFiltersBefore = _.cloneDeep(vm.owner.documentFilters);
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

    vm.changeBackendFilter = function(documentFilterName) {
      vm.owner.getBackendFilter(documentFilterName).
               then(function() {
                      vm.documentFiltersBefore = _.cloneDeep(vm.owner.documentFilters);
                    },
                    function() {
                      vm.owner.documentFilters = vm.documentFiltersBefore;
                    });
    };
  }
})();
