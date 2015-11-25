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
      var docFilter = 'default';
      var openFilters = {};

      $scope.fbControls.forEach(function(ctr) {
        if(ctr.nodeName === 'MN-FB-DOCUMENT-FILTER-SELECTOR') {
          docFilter = vm.seletedDocumentFilters[0].name;
        }
        if(ctr.nodeName === 'MN-FB-DATE-SELECTOR') {
          openFilters[ctr.field] = vm[_.camelCase(ctr.field)];
        }
        if(ctr.nodeName === 'MN-FB-DATE-RANGE-SELECTOR') {
          openFilters[ctr.field] = vm[_.camelCase(ctr.field)];
        }
        if(ctr.nodeName === 'MN-FB-MULTI-SELECTOR') {
          openFilters[ctr.field] = _.map(vm['selected' + _.capitalize(_.camelCase(ctr.field))], 'name');
        }
      });

      vm.owner.getBackendFilter(docFilter, openFilters).
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
