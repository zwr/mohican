//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnFilterBarController', ['$scope', MnFilterBarController]);

  function MnFilterBarController($scope) {
    var vm = this;

    vm.statuses = [{name: 'created'}, {name: 'avoinna'}, {name: 'valmis'}, {name: 'deferred'}, {name: 'tuotannossa'}, {name: 'delivered'}];
    vm.statusesLabels = {
      nothingSelected: 'All'
    };

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

    vm.changeDocumentFilter = function() {
      vm.owner.getBackendFilter(vm.seletedDocumentFilters[0].name,
                                [{
                                  field: 'delivery_date',
                                  value: vm.dateFrom
                                },
                                {
                                  field: 'status',
                                  value: _.map(vm.selectedStatuses, 'name')
                                }]).
               then(function() {
                      vm.documentFiltersBefore = _.cloneDeep(vm.owner.documentFilters);
                    },
                    function() {
                      vm.owner.documentFilters = vm.documentFiltersBefore;
                    });
    };
  }
})();
