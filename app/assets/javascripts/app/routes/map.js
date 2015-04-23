//= require_self

(function(mnUtil) {
  'use strict';

  //arguments: (routeName, controller, service)
  mnUtil.defineMohicanRoute(
    'map',
    function(resolve) {
      var ctrl = this;
      ctrl.get = function() {
        resolve.pageItems().then(function(result) {
          ctrl.collection = result;
        });
      };
      ctrl.echo = resolve.echo;
      ctrl.get();
    },
    function(mnBaseService) {
      var service = {};
      mnBaseService.extendsTo(service);

      service.echo = function(text) {
        return text;
      };

      return service;
    }
  );
})(window.MohicanUtils);
