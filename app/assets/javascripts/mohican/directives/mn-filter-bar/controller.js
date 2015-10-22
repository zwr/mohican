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

    $scope.$watch(function() { return vm.owner.stateMachine.openfilters; },
                            function(newValue, oldValue) {
                              vm.dateFrom = newValue.delivery_date ? new Date(newValue.delivery_date) : undefined;
                              vm.statuses.forEach(function(status) {
                                status.selected = false;
                              });
                              if(newValue.status && vm.statuses) {
                                vm.statuses.forEach(function(status) {
                                  newValue.status.forEach(function(stateMachineStatus) {
                                    if(stateMachineStatus === status.name) {
                                      status.selected = true;
                                    }
                                  });
                                });
                              }
                            });

    vm.changeDocumentFilter = function() {
      vm.owner.getBackendFilter(vm.seletedDocumentFilters[0].name,
                                {
                                  'delivery_date': vm.dateFrom,
                                  'status':        _.map(vm.selectedStatuses, 'name')
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
