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

    vm.changeDocumentFilter = function() {
      vm.owner.getBackendFilter(vm.seletedDocumentFilters[0].name,
                                {
                                  'delivery_date': vm.dateFrom,
                                  'status':        _.map(vm.selectedStatus, 'name')
                                }).
               then(function() {
                      vm.documentFiltersBefore = _.cloneDeep(vm.owner.documentFilters);
                    },
                    function() {
                      vm.owner.documentFilters = vm.documentFiltersBefore;
                    });
    };

    vm.changeLayout = function(layoutName) {
      vm.owner.clientLayoutChanged(layoutName).
               then(function() {
                      vm.layoutsBefore = _.cloneDeep(vm.owner.layouts);
                    },
                    function() {
                      vm.owner.layouts = vm.layoutsBefore;
                    });
    };
  }
})();
