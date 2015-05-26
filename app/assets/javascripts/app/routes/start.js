//= require_self

(function(mnUtil) {
  'use strict';

  var ROUTE_NAME = 'start';
  var Controller = function(resolve, $stateParams, $state) {
    _.assign(this, mnUtil.mnBaseController);
    this.initialize(resolve, $stateParams, $state);
  };

  Controller.$inject = [ROUTE_NAME + 'ServiceResolve', '$stateParams', '$state'];

  //arguments: (routeName, controller, service)
  mnUtil.defineMohicanRoute(
    ROUTE_NAME,
    Controller,
    function () {
      var service = {};
      return service;
    }
  );
})(window.MohicanUtils);
