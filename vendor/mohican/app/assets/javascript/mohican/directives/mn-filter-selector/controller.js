//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterSelectorController', ['$scope', MnFilterSelectorController]);

  function MnFilterSelectorController($scope) {
    var vm = this;

    $scope.$watchCollection(function() { return vm.owner.documentFilters; },
                            function(newValue, oldValue) {
                              vm.documentFiltersBefore = _.cloneDeep(vm.owner.documentFilters);
                            });
  }
})();
