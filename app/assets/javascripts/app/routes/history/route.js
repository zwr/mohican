//=require ./service
//=require ./template
//= require_self

(function(mnUtil) {
  'use strict';

  mnUtil.defineMohicanRoute('history', function(resolve) {
    var vm = this;
    function _get() {
      resolve.pageItems().then(function(result) {
        vm.collection = result;
      });
    }

    _get();

    _.extend(vm, {
      get: _get,
    });
  });
})(window.MohicanUtils);
